import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MobileHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  right?: ReactNode;
  gradient?: boolean;
}

export default function MobileHeader({ title, subtitle, showBack, right, gradient }: MobileHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className={gradient ? "bg-gradient-hero text-primary-foreground" : "bg-card border-b border-border"}>
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-primary-foreground/10 -ml-1 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-base font-bold leading-tight">{title}</h1>
            {subtitle && <p className="text-xs opacity-70">{subtitle}</p>}
          </div>
        </div>
        {right && <div>{right}</div>}
      </div>
    </div>
  );
}
