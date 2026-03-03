import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Upload, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";

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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-warning" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Program Full</h1>
          <p className="text-muted-foreground mb-6">The pilot has reached its maximum capacity of {pilot.maxEligible} students. Stay tuned for expansion!</p>
          <Button onClick={() => navigate("/")} variant="outline"><ArrowLeft className="mr-2 w-4 h-4" /> Back Home</Button>
        </motion.div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-success" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Application Received!</h1>
          <p className="text-muted-foreground mb-6">We'll verify your student ID and email. You'll receive your exclusive coupon once approved.</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/")} variant="outline"><ArrowLeft className="mr-2 w-4 h-4" /> Home</Button>
            <Button onClick={() => navigate("/student")} className="bg-gradient-primary text-primary-foreground">My Dashboard</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-hero text-primary-foreground py-8">
        <div className="container">
          <Button onClick={() => navigate("/")} variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-4">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Student Verification</h1>
              <p className="text-sm opacity-80">{pilot.currentEligible} / {pilot.maxEligible} spots taken</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-xl py-8">
        <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div>
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" value={form.fullName} onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))} placeholder="Enter your full name" />
            {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <Label htmlFor="college">College / University</Label>
            <Select value={form.college} onValueChange={v => setForm(f => ({ ...f, college: v }))}>
              <SelectTrigger><SelectValue placeholder="Select your college" /></SelectTrigger>
              <SelectContent>
                {["Delhi University", "NSUT", "DTU", "IP University", "Amity University", "IIIT Delhi", "JNU", "Jamia Millia"].map(c => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.college && <p className="text-destructive text-xs mt-1">{errors.college}</p>}
          </div>

          <div>
            <Label htmlFor="email">University Email</Label>
            <Input id="email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@university.ac.in" />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
          </div>

          <div>
            <Label>Student ID Upload</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 transition-colors">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload your student ID card</p>
              <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>

          <div>
            <Label htmlFor="enrollment">Enrollment Duration</Label>
            <Select value={form.enrollmentDuration} onValueChange={v => setForm(f => ({ ...f, enrollmentDuration: v }))}>
              <SelectTrigger><SelectValue placeholder="Select duration" /></SelectTrigger>
              <SelectContent>
                {["2021-2025", "2022-2026", "2023-2027", "2024-2028"].map(d => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.enrollmentDuration && <p className="text-destructive text-xs mt-1">{errors.enrollmentDuration}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact">Contact Number</Label>
              <Input id="contact" value={form.contactNumber} onChange={e => setForm(f => ({ ...f, contactNumber: e.target.value }))} placeholder="10-digit number" />
              {errors.contactNumber && <p className="text-destructive text-xs mt-1">{errors.contactNumber}</p>}
            </div>
            <div>
              <Label htmlFor="zomato">Zomato Mobile</Label>
              <Input id="zomato" value={form.zomatoMobile} onChange={e => setForm(f => ({ ...f, zomatoMobile: e.target.value }))} placeholder="Registered number" />
              {errors.zomatoMobile && <p className="text-destructive text-xs mt-1">{errors.zomatoMobile}</p>}
            </div>
          </div>

          <Button type="submit" size="lg" className="w-full bg-gradient-primary text-primary-foreground font-bold shadow-primary">
            Submit Application
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
