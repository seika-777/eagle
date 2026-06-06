import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { action } = body;

  if (action === "login") {
    const { userId, password } = body as { userId: string; password: string };
    const { data: userMeta, error: metaError } = await supabaseAdmin
      .from("user_meta")
      .select("role")
      .eq("user_id", userId)
      .single();

    if (metaError || !userMeta) {
      return NextResponse.json(
        { error: "ユーザーIDまたはパスワードが正しくありません", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const email = `${userId}@eagle-admin.internal`;
    const response = NextResponse.json({ role: userMeta.role });

    // @supabase/ssr で signIn することで正しいクッキー形式が自動セットされる
    const supabaseSSR = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => request.cookies.getAll(),
          setAll: (cookiesToSet) => {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { error: signInError } = await supabaseSSR.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return NextResponse.json(
        { error: "ユーザーIDまたはパスワードが正しくありません", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    return response;
  }

  if (action === "signup") {
    const { signupCode, userId, displayName, password } = body as {
      signupCode: string;
      userId: string;
      displayName: string;
      password: string;
    };

    if (signupCode !== process.env.SIGNUP_CODE) {
      return NextResponse.json(
        { error: "登録コードが正しくありません", code: "FORBIDDEN" },
        { status: 403 }
      );
    }

    const userIdPattern = /^[a-zA-Z0-9_]+$/;
    if (!userIdPattern.test(userId)) {
      return NextResponse.json(
        { error: "ユーザーIDは英数字とアンダースコアのみ使用できます", code: "BAD_REQUEST" },
        { status: 400 }
      );
    }

    const { data: existing } = await supabaseAdmin
      .from("user_meta")
      .select("id")
      .eq("user_id", userId)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: "このユーザーIDはすでに使用されています", code: "CONFLICT" },
        { status: 409 }
      );
    }

    const email = `${userId}@eagle-admin.internal`;
    const { data: authUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError || !authUser.user) {
      return NextResponse.json(
        { error: "登録に失敗しました。もう一度お試しください", code: "INTERNAL_ERROR" },
        { status: 500 }
      );
    }

    const { error: insertError } = await supabaseAdmin.from("user_meta").insert({
      id: authUser.user.id,
      user_id: userId,
      display_name: displayName,
      role: "common",
      is_editable: false,
    });

    if (insertError) {
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json(
        { error: "登録に失敗しました。もう一度お試しください", code: "INTERNAL_ERROR" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  }

  if (action === "reset-password") {
    const { userId, password } = body as { userId: string; password: string };

    const { data: userMeta, error: metaError } = await supabaseAdmin
      .from("user_meta")
      .select("id, is_editable")
      .eq("user_id", userId)
      .single();

    if (metaError || !userMeta) {
      return NextResponse.json(
        { error: "ユーザーIDまたはパスワードが正しくありません", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    if (!userMeta.is_editable) {
      return NextResponse.json(
        { error: "パスワードのリセットが許可されていません", code: "FORBIDDEN" },
        { status: 403 }
      );
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userMeta.id, {
      password,
    });

    if (updateError) {
      return NextResponse.json(
        { error: "リセットに失敗しました。もう一度お試しください", code: "INTERNAL_ERROR" },
        { status: 500 }
      );
    }

    await supabaseAdmin
      .from("user_meta")
      .update({ is_editable: false })
      .eq("id", userMeta.id);

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "不正なリクエストです", code: "BAD_REQUEST" }, { status: 400 });
}
