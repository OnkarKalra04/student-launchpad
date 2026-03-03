import { motion } from "framer-motion";
import { GraduationCap, Ticket, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { useToast } from "@/hooks/use-toast";
import MobileLayout from "@/components/MobileLayout";
import MobileHeader from "@/components/MobileHeader";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { students, currentStudentEmail, submitFeedback, pilots } = useStore();
  const { toast } = useToast();
  const [showFeedback, setShowFeedback] = useState(false);

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
      <MobileLayout>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-bold mb-2">No Profile Found</h2>
            <p className="text-muted-foreground text-sm mb-4">Apply to get started.</p>
            <Button onClick={() => navigate("/apply")} className="bg-gradient-primary text-primary-foreground rounded-xl">Apply Now</Button>
          </div>
        </div>
      </MobileLayout>
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
    toast({ title: "Thank you!", description: "Your feedback helps us improve." });
  };

  return (
    <MobileLayout>
      {/* Profile Header */}
      <div className="bg-gradient-hero text-primary-foreground px-5 pt-6 pb-5">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-lg font-bold">{student.fullName}</h1>
          <Badge variant="secondary" className="bg-primary-foreground/15 text-primary-foreground text-[10px] border-0">
            <GraduationCap className="w-3 h-3 mr-1" /> Student
          </Badge>
        </div>
        <p className="text-xs opacity-80">{student.college} · {student.email}</p>
      </div>

      <div className="px-5 py-5 space-y-4">
        {/* Status Card */}
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`${sc.bg} rounded-2xl p-4 flex items-center gap-3`}>
          <sc.icon className={`w-7 h-7 ${sc.color} ${sc.animate ? "animate-spin" : ""}`} />
          <div>
            <p className={`font-bold text-sm ${sc.color}`}>{sc.label}</p>
            <p className="text-[11px] text-muted-foreground">Applied {new Date(student.appliedAt).toLocaleDateString()}</p>
          </div>
        </motion.div>

        {/* Coupon Card */}
        {student.status === "verified" && student.couponCode && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="bg-gradient-primary text-primary-foreground rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-primary-foreground/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <Ticket className="w-4 h-4" />
                <span className="text-[11px] font-medium opacity-80">Your Student Coupon</span>
              </div>
              <p className="text-2xl font-extrabold tracking-wider mb-0.5">{student.couponCode}</p>
              <p className="text-xs opacity-80">{pilot.discountPercent}% off · Auto-applied at checkout</p>
              <div className="mt-3 pt-3 border-t border-primary-foreground/20 flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {pilot.couponValidityHours}h</span>
                <span>·</span>
                <span>{pilot.maxUsagePerDay}/day</span>
                <span>·</span>
                <span>Non-shareable</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        {student.status === "verified" && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Before", value: student.ordersBeforeProgram },
              { label: "During", value: student.ordersDuringProgram },
              { label: "Avg ₹", value: `₹${student.avgOrderValue}` },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.05 }} className="bg-card rounded-2xl p-3 text-center border border-border shadow-card">
                <p className="text-xl font-extrabold">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </motion.div>
            ))}
          </div>
        )}

        {/* Feedback */}
        {student.status === "verified" && !student.feedback && !showFeedback && (
          <Button onClick={() => setShowFeedback(true)} variant="outline" className="w-full rounded-xl h-11">Share Feedback</Button>
        )}

        {showFeedback && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl p-5 border border-border space-y-4">
            <h3 className="font-bold text-sm">Quick Feedback</h3>
            <div>
              <Label className="text-xs">Was the discount valuable?</Label>
              <RadioGroup value={feedback.discountValuable ? "yes" : "no"} onValueChange={v => setFeedback(f => ({ ...f, discountValuable: v === "yes" }))} className="flex gap-4 mt-1.5">
                <div className="flex items-center gap-1.5"><RadioGroupItem value="yes" id="dv-y" /><Label htmlFor="dv-y" className="text-xs">Yes</Label></div>
                <div className="flex items-center gap-1.5"><RadioGroupItem value="no" id="dv-n" /><Label htmlFor="dv-n" className="text-xs">No</Label></div>
              </RadioGroup>
            </div>
            <div>
              <Label className="text-xs">Would you continue using this?</Label>
              <RadioGroup value={feedback.wouldContinue ? "yes" : "no"} onValueChange={v => setFeedback(f => ({ ...f, wouldContinue: v === "yes" }))} className="flex gap-4 mt-1.5">
                <div className="flex items-center gap-1.5"><RadioGroupItem value="yes" id="wc-y" /><Label htmlFor="wc-y" className="text-xs">Yes</Label></div>
                <div className="flex items-center gap-1.5"><RadioGroupItem value="no" id="wc-n" /><Label htmlFor="wc-n" className="text-xs">No</Label></div>
              </RadioGroup>
            </div>
            <div>
              <Label className="text-xs">Orders/month: {feedback.ordersPerMonth}</Label>
              <Slider value={[feedback.ordersPerMonth]} onValueChange={([v]) => setFeedback(f => ({ ...f, ordersPerMonth: v }))} min={1} max={30} step={1} className="mt-2" />
            </div>
            <div>
              <Label className="text-xs">Reasonable discount: {feedback.reasonableDiscount}%</Label>
              <Slider value={[feedback.reasonableDiscount]} onValueChange={([v]) => setFeedback(f => ({ ...f, reasonableDiscount: v }))} min={5} max={30} step={5} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="comments" className="text-xs">Comments (optional)</Label>
              <Textarea id="comments" value={feedback.comments} onChange={e => setFeedback(f => ({ ...f, comments: e.target.value }))} placeholder="Your thoughts..." className="mt-1 rounded-xl text-sm" rows={3} />
            </div>
            <Button onClick={handleFeedback} className="w-full bg-gradient-primary text-primary-foreground font-bold h-11 rounded-xl">Submit Feedback</Button>
          </motion.div>
        )}

        {student.feedback && (
          <div className="bg-success/5 rounded-2xl p-4 flex items-center gap-3 border border-success/20">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <p className="text-xs text-muted-foreground">Thank you for your feedback!</p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
}
