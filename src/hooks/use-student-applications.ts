import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase, updateStudentStatus } from "@/lib/supabase";

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
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as StudentApplication[];
    },
    refetchInterval: 10000,
  });
}

export function useUpdateStudentStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "verified" | "rejected" | "suspended" }) =>
      updateStudentStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-applications"] });
    },
  });
}
