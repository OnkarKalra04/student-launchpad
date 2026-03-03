import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, ShieldCheck, Ticket, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: ShieldCheck, title: "Verified Students Only", desc: "University email + ID verification ensures genuine eligibility." },
  { icon: Ticket, title: "Exclusive Coupons", desc: "Auto-applied discounts on every order. No codes to remember." },
  { icon: TrendingUp, title: "Save More, Order More", desc: "Flat discounts on your favorite meals, every single day." },
];

export default function StudentLanding() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-primary-foreground blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-primary-foreground blur-3xl" />
        </div>
        <div className="container relative z-10 py-20 md:py-32">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-1.5 text-sm font-medium backdrop-blur-sm mb-6">
              <GraduationCap className="w-4 h-4" />
              Student Program — Limited Pilot
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Your campus.<br />Your cravings.<br />Your discounts.
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg">
              Verify your student ID and unlock exclusive daily discounts on Zomato. Currently available in Dwarka, Delhi.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate("/apply")} size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-bold text-base px-8 shadow-lg">
                Apply Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button onClick={() => navigate("/admin")} size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold">
                Admin Dashboard
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="container py-20">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-3xl font-bold text-center mb-12">
          How it works
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="bg-card rounded-xl p-6 shadow-card border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="bg-secondary py-16">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { label: "Pilot Location", value: "Dwarka, Delhi" },
            { label: "Max Eligible", value: "1,000" },
            { label: "Discount", value: "Up to 15%" },
            { label: "Status", value: "🟢 Active" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}>
              <p className="text-2xl md:text-3xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-20 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl font-bold mb-4">Ready to save on every order?</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Join the Student Program now. Limited spots available in the pilot.</p>
          <Button onClick={() => navigate("/apply")} size="lg" className="bg-gradient-primary text-primary-foreground font-bold px-10 shadow-primary">
            Get Started <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
