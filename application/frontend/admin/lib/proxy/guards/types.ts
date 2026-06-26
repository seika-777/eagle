import type { NextRequest, NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";

// proxy（旧 middleware）の各ガード間で共有するコンテキスト。
export type ProxyContext = {
  request: NextRequest;
  response: NextResponse;
  pathname: string;
  isApiRoute: boolean;
  supabase: SupabaseClient;
  user: User | null;
};

// null を返したら次のガードへ。NextResponse を返したらそこで応答確定。
export type Guard = (
  ctx: ProxyContext
) => Promise<NextResponse | null> | NextResponse | null;
