import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = supabaseUrl
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient>);

export interface PostItNote {
  id: string;
  content: string;
  x: number;
  y: number;
  color: string;
  rotation: number;
  fingerprint: string;
  avatar_url: string;
  created_at: string;
}
