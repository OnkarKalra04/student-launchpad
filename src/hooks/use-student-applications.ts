import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface StudentApplication {
  id: string;
  name: string;
  college_name: string;
  university_email: string;
  student_id: string;
  enrollment_duration: string;
  contact_number: string;
  zomato_mobile: string;
  created_at: string;
  status?: string;
}

export function useStudentApplications() {
  return useQuery({
    queryKey: ["student-applications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("student_applications")
        .select("id, name, college_name, university_email, student_id, enrollment_duration, contact_number, zomato_mobile, created_at, status")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as StudentApplication[];
    },
    refetchInterval: 10000, // Auto-refresh every 10 seconds for new applications
  });
}
