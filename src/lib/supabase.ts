import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zqqqimginstdsnulsyhj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncXFpbWdpbnN0ZHNudWx5c2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTI1MTEsImV4cCI6MjA4ODUyODUxMX0.86OOhrgGYimhcwBY4uDvd9unjWdB8IDBKNRa2Lq6Sro";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
