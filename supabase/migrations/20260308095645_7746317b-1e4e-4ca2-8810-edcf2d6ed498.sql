CREATE TABLE public.student_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  college_name TEXT NOT NULL,
  university_email TEXT NOT NULL,
  student_id TEXT NOT NULL,
  enrollment_duration TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  zomato_mobile TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.student_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.student_applications FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.student_applications FOR INSERT WITH CHECK (true);