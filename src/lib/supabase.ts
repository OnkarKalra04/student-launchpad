import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://zgqqimginstdsnulyshj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncXFpbWdpbnN0ZHNudWx5c2hqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5NTI1MTEsImV4cCI6MjA4ODUyODUxMX0.86OOhrgGYimhcwBY4uDvd9unjWdB8IDBKNRa2Lq6Sro";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export async function updateStudentStatus(id: string, status: "verified" | "rejected" | "suspended") {
  const { error } = await supabase
    .from("student_applications")
    .update({ status })
    .eq("id", id);
  
  if (error) throw error;
}
