import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { StudentApplication } from "@/hooks/use-student-applications";

interface RiskAlert {
  id: string;
  title: string;
  identifier: string;
  count: number;
  details?: string;
}

function findDuplicates(students: StudentApplication[]): RiskAlert[] {
  const alerts: RiskAlert[] = [];

  // Duplicate student_id
  const idMap = new Map<string, StudentApplication[]>();
  for (const s of students) {
    idMap.set(s.student_id, [...(idMap.get(s.student_id) ?? []), s]);
  }
  for (const [sid, group] of idMap) {
    if (group.length > 1) {
      alerts.push({
        id: `dup-sid-${sid}`,
        title: "Same student ID uploaded from multiple accounts",
        identifier: sid,
        count: group.length,
        details: group.map(g => g.university_email).join(", "),
      });
    }
  }

  // Duplicate contact_number
  const contactMap = new Map<string, StudentApplication[]>();
  for (const s of students) {
    contactMap.set(s.contact_number, [...(contactMap.get(s.contact_number) ?? []), s]);
  }
  for (const [num, group] of contactMap) {
    if (group.length > 1) {
      alerts.push({
        id: `dup-contact-${num}`,
        title: "Same contact number used in multiple applications",
        identifier: num,
        count: group.length,
      });
    }
  }

  // Duplicate zomato_mobile
  const zomatoMap = new Map<string, StudentApplication[]>();
  for (const s of students) {
    zomatoMap.set(s.zomato_mobile, [...(zomatoMap.get(s.zomato_mobile) ?? []), s]);
  }
  for (const [num, group] of zomatoMap) {
    if (group.length > 1) {
      alerts.push({
        id: `dup-zomato-${num}`,
        title: "Same Zomato account used across applications",
        identifier: num,
        count: group.length,
      });
    }
  }

  return alerts;
}

export default function RiskAlertsSection({ students }: { students: StudentApplication[] }) {
  const [resolved, setResolved] = useState<Set<string>>(new Set());
  const alerts = findDuplicates(students);

  if (alerts.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Risk Alerts</h2>
        <p className="text-sm text-muted-foreground">No risk alerts detected</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Risk Alerts</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {alerts.map(alert => {
          const isResolved = resolved.has(alert.id);
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`bg-card rounded-2xl p-5 border ${isResolved ? "border-border opacity-60" : "border-destructive/30"}`}
            >
              <div className="flex items-start gap-3">
                <ShieldAlert className={`w-4 h-4 mt-0.5 shrink-0 ${isResolved ? "text-muted-foreground" : "text-destructive"}`} />
                <div className="flex-1">
                  <p className="font-medium text-sm">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Identifier: {alert.identifier} · {alert.count} occurrences
                  </p>
                  {alert.details && (
                    <p className="text-xs text-muted-foreground mt-0.5">Emails: {alert.details}</p>
                  )}
                  <Badge variant="outline" className="text-[10px] mt-1.5">duplicate</Badge>
                </div>
              </div>
              {!isResolved && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setResolved(prev => new Set(prev).add(alert.id))}
                  className="w-full mt-3 h-8 text-xs rounded-lg"
                >
                  Resolve
                </Button>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
