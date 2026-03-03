import { motion } from "framer-motion";
import { GraduationCap, Ticket, Clock, ArrowLeft, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { students, currentStudentEmail, submitFeedback, pilots } = useStore();
  const { toast } = useToast();
  const [showFeedback, setShowFeedback] = useState(false);

  // Find student by email or show latest
  const student = currentStudentEmail
    ? students.find(s => s.email === currentStudentEmail)
    : students.find(s => s.status === "verified");

  const pilot = pilots[0];

  const [feedback, setFeedback] = useState({
    discountValuable: true,
    wouldContinue: true,
    ordersPerMonth: 5,
    reasonableDiscount: 15,
    comments: "",
  });

  if (!student) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Student Profile Found</h2>
          <p className="text-muted-foreground mb-4">Apply to the Student Program to get started.</p>
          <Button onClick={() => navigate("/apply")} className="bg-gradient-primary text-primary-foreground">Apply Now</Button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    pending: { icon: Loader2, color: "text-warning", bg: "bg-warning/10", label: "Verification Pending", animate: true },
    verified: { icon: CheckCircle2, color: "text-success", bg: "bg-success/10", label: "Verified ✓", animate: false },
    rejected: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Rejected", animate: false },
    suspended: { icon: XCircle, color: "text-destructive", bg: "bg-destructive/10", label: "Suspended", animate: false },
  };
  const sc = statusConfig[student.status];

  const handleFeedback = () => {
    submitFeedback(student.id, feedback);
    setShowFeedback(false);
    toast({ title: "Thank you!", description: "Your feedback helps us improve the program." });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-hero text-primary-foreground py-8">
        <div className="container">
          <Button onClick={() => navigate("/")} variant="ghost" size="sm" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10 mb-4">
            <ArrowLeft className="mr-2 w-4 h-4" /> Back
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{student.fullName}</h1>
              <p className="text-sm opacity-80">{student.college} · {student.email}</p>
            </div>
            <div className="flex items-center gap-2 bg-primary-foreground/15 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-medium">Student</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-2xl py-8 space-y-6">
        {/* Status */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`${sc.bg} rounded-xl p-5 flex items-center gap-4`}>
          <sc.icon className={`w-8 h-8 ${sc.color} ${sc.animate ? "animate-spin" : ""}`} />
          <div>
            <p className={`font-bold ${sc.color}`}>{sc.label}</p>
            <p className="text-sm text-muted-foreground">Applied on {new Date(student.appliedAt).toLocaleDateString()}</p>
          </div>
        </motion.div>

        {/* Coupon Card */}
        {student.status === "verified" && student.couponCode && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-primary text-primary-foreground rounded-xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-start justify-between relative z-10">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Ticket className="w-5 h-5" />
                  <span className="text-sm font-medium opacity-80">Your Student Coupon</span>
                </div>
                <p className="text-3xl font-extrabold tracking-wider mb-1">{student.couponCode}</p>
                <p className="text-sm opacity-80">{pilot.discountPercent}% off · Auto-applied at checkout</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-sm opacity-80">
                  <Clock className="w-4 h-4" />
                  <span>Valid {pilot.couponValidityHours}h</span>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-primary-foreground/20 flex gap-4 text-sm">
              <span>Max {pilot.maxUsagePerDay}/day</span>
              <span>·</span>
              <span>Max {pilot.maxUsagePerWeek}/week</span>
              <span>·</span>
              <span>Non-transferable</span>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        {student.status === "verified" && (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Orders Before", value: student.ordersBeforeProgram },
              { label: "Orders During", value: student.ordersDuringProgram },
              { label: "Avg Order ₹", value: `₹${student.avgOrderValue}` },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.05 }} className="bg-card rounded-xl p-4 text-center border border-border shadow-card">
                <p className="text-2xl font-extrabold">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Feedback */}
        {student.status === "verified" && !student.feedback && !showFeedback && (
          <Button onClick={() => setShowFeedback(true)} variant="outline" className="w-full">Share Your Feedback</Button>
        )}

        {showFeedback && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-xl p-6 border border-border space-y-5">
            <h3 className="font-bold text-lg">Quick Feedback</h3>
            <div>
              <Label>Was the discount valuable to you?</Label>
              <RadioGroup value={feedback.discountValuable ? "yes" : "no"} onValueChange={v => setFeedback(f => ({ ...f, discountValuable: v === "yes" }))} className="flex gap-4 mt-2">
                <div className="flex items-center gap-2"><RadioGroupItem value="yes" id="dv-y" /><Label htmlFor="dv-y">Yes</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="no" id="dv-n" /><Label htmlFor="dv-n">No</Label></div>
              </RadioGroup>
            </div>
            <div>
              <Label>Would you continue using this?</Label>
              <RadioGroup value={feedback.wouldContinue ? "yes" : "no"} onValueChange={v => setFeedback(f => ({ ...f, wouldContinue: v === "yes" }))} className="flex gap-4 mt-2">
                <div className="flex items-center gap-2"><RadioGroupItem value="yes" id="wc-y" /><Label htmlFor="wc-y">Yes</Label></div>
                <div className="flex items-center gap-2"><RadioGroupItem value="no" id="wc-n" /><Label htmlFor="wc-n">No</Label></div>
              </RadioGroup>
            </div>
            <div>
              <Label>Orders per month: {feedback.ordersPerMonth}</Label>
              <Slider value={[feedback.ordersPerMonth]} onValueChange={([v]) => setFeedback(f => ({ ...f, ordersPerMonth: v }))} min={1} max={30} step={1} className="mt-2" />
            </div>
            <div>
              <Label>Reasonable discount %: {feedback.reasonableDiscount}%</Label>
              <Slider value={[feedback.reasonableDiscount]} onValueChange={([v]) => setFeedback(f => ({ ...f, reasonableDiscount: v }))} min={5} max={30} step={5} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="comments">Any comments?</Label>
              <Textarea id="comments" value={feedback.comments} onChange={e => setFeedback(f => ({ ...f, comments: e.target.value }))} placeholder="Optional feedback..." className="mt-1" />
            </div>
            <Button onClick={handleFeedback} className="w-full bg-gradient-primary text-primary-foreground font-bold">Submit Feedback</Button>
          </motion.div>
        )}

        {student.feedback && (
          <div className="bg-success/5 rounded-xl p-4 flex items-center gap-3 border border-success/20">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <p className="text-sm text-muted-foreground">Thank you for your feedback!</p>
          </div>
        )}
      </div>
    </div>
  );
}
