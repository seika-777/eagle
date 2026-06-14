// API Route 専用。"use client" コンポーネント・middleware から import 禁止（Service Role Key 漏洩防止）。
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
