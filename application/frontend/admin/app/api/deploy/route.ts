import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createServerClient } from "@supabase/ssr";

type ErrorResponse = {
  error: string;
  code: string;
};

const errorResponse = (error: string, code: string, status: number) =>
  NextResponse.json<ErrorResponse>({ error, code }, { status });

async function getAuthenticatedUser(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: () => {},
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: userMeta } = await supabaseAdmin
    .from("user_meta")
    .select("role")
    .eq("id", user.id)
    .single();

  if (userMeta?.role !== "admin") return null;
  return user;
}

export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  if (!user) return errorResponse("Forbidden", "FORBIDDEN", 403);

  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!deployHookUrl)
    return errorResponse(
      "Deploy hook URL is not configured",
      "MISSING_DEPLOY_HOOK_URL",
      400
    );

  const response = await fetch(deployHookUrl, { method: "POST" });
  if (!response.ok)
    return errorResponse("Failed to trigger deployment", "DEPLOY_FAILED", 500);

  await supabaseAdmin
    .from("options")
    .upsert({ key: "last_deployed_at", value: new Date().toISOString() });

  return NextResponse.json({ success: true });
}
