import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, ShieldCheck, Ticket, TrendingUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MobileLayout from "@/components/MobileLayout";

const features = [
  { icon: ShieldCheck, title: "Verified Only", desc: "University email + ID verification ensures genuine eligibility." },
  { icon: Ticket, title: "Exclusive Coupons", desc: "Auto-applied discounts on every order. No codes needed." },
  { icon: TrendingUp, title: "Save Daily", desc: "Flat discounts on your favorite meals, every single day." },
];

export default function StudentLanding() {
  const navigate = useNavigate();

  return (
    <MobileLayout>
      {/* Hero Card */}
      <div className="bg-gradient-hero text-primary-foreground px-5 pt-10 pb-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-5 w-48 h-48 rounded-full bg-primary-foreground blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary-foreground blur-3xl" />
        </div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-semibold backdrop-blur-sm mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Student Program — Limited Pilot
          </div>
          <h1 className="text-3xl font-extrabold leading-tight mb-3">
            Your campus.<br />Your cravings.<br />Your discounts.
          </h1>
          <p className="text-sm opacity-85 mb-6 max-w-xs">
            Verify your student ID and unlock exclusive daily discounts. Currently in Dwarka, Delhi.
          </p>
          <Button
            onClick={() => navigate("/apply")}
            size="lg"
            className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold text-base shadow-lg h-12 rounded-xl"
          >
            Apply Now <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>

      {/* Features */}
      <div className="px-5 py-6 space-y-3">
        <h2 className="text-lg font-bold px-1">How it works</h2>
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + i * 0.08 }}
            className="bg-card rounded-2xl p-4 shadow-card border border-border flex items-start gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <f.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-bold mb-0.5">{f.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Strip */}
      <div className="mx-5 bg-secondary rounded-2xl p-5">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Location", value: "Dwarka" },
            { label: "Max Students", value: "1,000" },
            { label: "Discount", value: "Up to 15%" },
            { label: "Status", value: "🟢 Active" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="text-center"
            >
              <p className="text-lg font-extrabold">{s.value}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-5 py-8 text-center">
        <GraduationCap className="w-10 h-10 text-primary mx-auto mb-3" />
        <h2 className="text-lg font-bold mb-1">Ready to save?</h2>
        <p className="text-muted-foreground text-xs mb-5">Limited spots in the pilot.</p>
        <Button
          onClick={() => navigate("/apply")}
          className="w-full bg-gradient-primary text-primary-foreground font-bold h-12 rounded-xl shadow-primary"
        >
          Get Started <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </MobileLayout>
  );
}
