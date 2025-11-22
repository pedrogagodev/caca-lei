import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/env";

const { url: supabaseUrl, anonKey: supabaseKey } = getSupabaseEnv();

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );