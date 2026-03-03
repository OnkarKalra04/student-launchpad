import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import MobileLayout from "@/components/MobileLayout";
import MobileHeader from "@/components/MobileHeader";

const eduDomains = [".ac.in", ".edu", ".edu.in"];

export default function ApplicationForm() {
  const navigate = useNavigate();
  const { addStudent, pilots, setCurrentStudentEmail } = useStore();
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const pilot = pilots[0];
  const isFull = pilot && pilot.currentEligible >= pilot.maxEligible;

  const [form, setForm] = useState({
    fullName: "", college: "", email: "", enrollmentDuration: "", contactNumber: "", zomatoMobile: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName.trim()) e.fullName = "Required";
    if (!form.college) e.college = "Required";
    if (!form.email.trim()) e.email = "Required";
    else if (!eduDomains.some(d => form.email.endsWith(d))) e.email = "Must be a valid university email (.ac.in, .edu)";
    if (!form.enrollmentDuration) e.enrollmentDuration = "Required";
    if (!form.contactNumber.match(/^\d{10}$/)) e.contactNumber = "Must be 10 digits";
    if (!form.zomatoMobile.match(/^\d{10}$/)) e.zomatoMobile = "Must be 10 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFull) return;
    if (!validate()) return;
    addStudent({ ...form, studentIdUrl: "/mock-upload" });
    setCurrentStudentEmail(form.email);
    setSubmitted(true);
    toast({ title: "Application Submitted!", description: "We'll verify your student ID and notify you." });
  };

  if (isFull) {
    return (
      <MobileLayout>
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-warning" />
            </div>
            <h1 className="text-xl font-bold mb-2">Program Full</h1>
            <p className="text-muted-foreground text-sm mb-6">Maximum capacity of {pilot.maxEligible} students reached.</p>
            <Button onClick={() => navigate("/")} variant="outline" className="rounded-xl">Back Home</Button>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  if (submitted) {
    return (
      <MobileLayout>
        <div className="flex-1 flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h1 className="text-xl font-bold mb-2">Application Received!</h1>
            <p className="text-muted-foreground text-sm mb-6">We'll verify your student ID and email you.</p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/")} variant="outline" className="rounded-xl">Home</Button>
              <Button onClick={() => navigate("/student")} className="bg-gradient-primary text-primary-foreground rounded-xl">My Dashboard</Button>
            </div>
          </motion.div>
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      <MobileHeader title="Student Verification" subtitle={`${pilot.currentEligible} / ${pilot.maxEligible} spots taken`} showBack gradient />

      <div className="px-5 py-6">
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div>
            <Label htmlFor="fullName" className="text-xs font-semibold">Full Name</Label>
            <Input id="fullName" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Enter your full name" className="mt-1 h-11 rounded-xl" />
            {errors.fullName && <p className="text-destructive text-[11px] mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <Label className="text-xs font-semibold">College / University</Label>
            <Select value={form.college} onValueChange={v => setForm(f => ({ ...f, college: v }))}>
              <SelectTrigger className="mt-1 h-11 rounded-xl"><SelectValue placeholder="Select your college" /></SelectTrigger>
              <SelectContent>
                {["Delhi University", "NSUT", "DTU", "IP University", "Amity University", "IIIT Delhi", "JNU", "Jamia Millia"].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.college && <p className="text-destructive text-[11px] mt-1">{errors.college}</p>}
          </div>

          <div>
            <Label htmlFor="email" className="text-xs font-semibold">University Email</Label>
            <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@university.ac.in" className="mt-1 h-11 rounded-xl" />
            {errors.email && <p className="text-destructive text-[11px] mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label className="text-xs font-semibold">Student ID Upload</Label>
            <div className="border-2 border-dashed border-border rounded-2xl p-5 text-center cursor-pointer hover:border-primary/50 transition-colors mt-1">
              <Upload className="w-7 h-7 text-muted-foreground mx-auto mb-1.5" />
              <p className="text-xs text-muted-foreground">Tap to upload your student ID card</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div>
            <Label className="text-xs font-semibold">Enrollment Duration</Label>
            <Select value={form.enrollmentDuration} onValueChange={v => setForm(f => ({ ...f, enrollmentDuration: v }))}>
              <SelectTrigger className="mt-1 h-11 rounded-xl"><SelectValue placeholder="Select duration" /></SelectTrigger>
              <SelectContent>
                {["2021-2025", "2022-2026", "2023-2027", "2024-2028"].map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.enrollmentDuration && <p className="text-destructive text-[11px] mt-1">{errors.enrollmentDuration}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs font-semibold">Contact Number</Label>
              <Input value={form.contactNumber} onChange={e => setForm(f => ({ ...f, contactNumber: e.target.value }))} placeholder="10 digits" className="mt-1 h-11 rounded-xl" />
              {errors.contactNumber && <p className="text-destructive text-[11px] mt-1">{errors.contactNumber}</p>}
            </div>
            <div>
              <Label className="text-xs font-semibold">Zomato Mobile</Label>
              <Input value={form.zomatoMobile} onChange={e => setForm(f => ({ ...f, zomatoMobile: e.target.value }))} placeholder="Registered #" className="mt-1 h-11 rounded-xl" />
              {errors.zomatoMobile && <p className="text-destructive text-[11px] mt-1">{errors.zomatoMobile}</p>}
            </div>
          </div>

          <Button type="submit" className="w-full bg-gradient-primary text-primary-foreground font-bold h-12 rounded-xl shadow-primary mt-2">
            Submit Application
          </Button>
        </motion.form>
      </div>
    </MobileLayout>
  );
}
