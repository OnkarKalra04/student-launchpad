DROP POLICY IF EXISTS "Allow public insert access" ON public.student_applications;
DROP POLICY IF EXISTS "Allow public read access" ON public.student_applications;
DROP POLICY IF EXISTS "Allow public update access" ON public.student_applications;

CREATE POLICY "Allow public insert access" ON public.student_applications FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public read access" ON public.student_applications FOR SELECT TO public USING (true);
CREATE POLICY "Allow public update access" ON public.student_applications FOR UPDATE TO public USING (true) WITH CHECK (true);