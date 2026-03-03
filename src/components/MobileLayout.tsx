import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, GraduationCap, Ticket, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const tabs = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/apply", icon: GraduationCap, label: "Apply" },
  { path: "/student", icon: Ticket, label: "My Coupon" },
  { path: "/admin", icon: Settings, label: "Admin" },
];

interface MobileLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export default function MobileLayout({ children, hideNav }: MobileLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Safe area top */}
      <div className="h-[env(safe-area-inset-top)] bg-background" />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>

      {/* Bottom Tab Bar */}
      {!hideNav && (
        <nav className="fixed bottom-0 inset-x-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border">
          <div className="flex items-center justify-around h-16 px-2 pb-[env(safe-area-inset-bottom)]">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.path;
              return (
                <button
                  key={tab.path}
                  onClick={() => navigate(tab.path)}
                  className={cn(
                    "flex flex-col items-center justify-center gap-0.5 w-16 h-full relative transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute -top-px left-2 right-2 h-0.5 bg-primary rounded-full"
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                    />
                  )}
                  <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[10px] font-semibold">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
