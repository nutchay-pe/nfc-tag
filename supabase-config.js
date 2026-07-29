// Fill these in from Supabase Dashboard > Project Settings > API.
// SUPABASE_ANON_KEY is safe to expose client-side -- it only ever has the
// access the RLS policies / RPC grants in supabase/schema.sql allow.
const SUPABASE_URL = "https://umdurttmoiuvoqchamzo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_o25GXruu-25Ai1Zm2sofqA_0Qh6qiQW";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
