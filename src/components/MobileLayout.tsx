import { ReactNode } from "react";

interface MobileLayoutProps {
  children: ReactNode;
  hideNav?: boolean;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="h-[env(safe-area-inset-top)] bg-background" />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
