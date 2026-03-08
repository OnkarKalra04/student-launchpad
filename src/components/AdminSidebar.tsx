import { Users, TrendingUp, ShieldAlert, FlaskConical, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "students", icon: Users, label: "Students" },
  { id: "controls", icon: Settings, label: "Pilot Controls" },
  { id: "analytics", icon: TrendingUp, label: "Analytics" },
  { id: "ab", icon: FlaskConical, label: "A/B Tests" },
  { id: "risk", icon: ShieldAlert, label: "Risk Alerts" },
];

interface AdminSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  pilotActive: boolean;
}

export default function AdminSidebar({ activeTab, onTabChange, pilotActive }: AdminSidebarProps) {
  return (
    <aside className="w-60 shrink-0 border-r border-border bg-sidebar-background min-h-screen flex flex-col">
      {/* Logo / Header */}
      <div className="px-5 py-6 border-b border-sidebar-border">
        <h1 className="text-lg font-extrabold tracking-tight">Admin Console</h1>
        <p className="text-xs text-muted-foreground mt-0.5">Pilot Control Center</p>
        <div className="mt-3">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full",
              pilotActive
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            <span className={cn("w-1.5 h-1.5 rounded-full", pilotActive ? "bg-success" : "bg-destructive")} />
            {pilotActive ? "Pilot Active" : "Pilot Paused"}
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
