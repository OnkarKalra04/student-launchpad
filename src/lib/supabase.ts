import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zqqqimginstdsnulsyhj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_hjs25Ei9yManrhH_OUGSUQ_bTUfnZxA";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
