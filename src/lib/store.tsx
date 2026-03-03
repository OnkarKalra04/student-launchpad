import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// Types
export type StudentStatus = "pending" | "verified" | "rejected" | "suspended";
export type ProgramStatus = "active" | "paused" | "full";

export interface Student {
  id: string;
  fullName: string;
  college: string;
  email: string;
  studentIdUrl: string;
  enrollmentDuration: string;
  contactNumber: string;
  zomatoMobile: string;
  status: StudentStatus;
  appliedAt: string;
  verifiedAt?: string;
  ordersBeforeProgram: number;
  ordersDuringProgram: number;
  avgOrderValue: number;
  couponUsed: boolean;
  couponCode?: string;
  feedback?: FeedbackData;
}

export interface FeedbackData {
  discountValuable: boolean;
  wouldContinue: boolean;
  ordersPerMonth: number;
  reasonableDiscount: number;
  comments?: string;
}

export interface PilotConfig {
  id: string;
  city: string;
  zone: string;
  maxEligible: number;
  currentEligible: number;
  discountPercent: number;
  maxUsagePerDay: number;
  maxUsagePerWeek: number;
  couponValidityHours: number;
  isActive: boolean;
  activatedAt: string;
  estimatedMargin: number;
  baselineOrderFreq: number;
  baselineAOV: number;
}

export interface ABTest {
  id: string;
  name: string;
  locations: { city: string; zone: string; discount: number; orders: number; revenue: number; burn: number; retention: number }[];
}

export interface RiskAlert {
  id: string;
  type: "duplicate_id" | "multi_account" | "abnormal_redemption" | "frequency_spike";
  studentId: string;
  studentName: string;
  description: string;
  timestamp: string;
  resolved: boolean;
}

// Mock data generators
const mockStudents: Student[] = [
  { id: "s1", fullName: "Priya Sharma", college: "Delhi University", email: "priya@du.ac.in", studentIdUrl: "/mock", enrollmentDuration: "2023-2027", contactNumber: "9876543210", zomatoMobile: "9876543210", status: "verified", appliedAt: "2024-01-15", verifiedAt: "2024-01-16", ordersBeforeProgram: 4, ordersDuringProgram: 11, avgOrderValue: 245, couponUsed: true, couponCode: "STU-PRIYA-001", feedback: { discountValuable: true, wouldContinue: true, ordersPerMonth: 8, reasonableDiscount: 15 } },
  { id: "s2", fullName: "Rahul Verma", college: "NSUT", email: "rahul@nsut.ac.in", studentIdUrl: "/mock", enrollmentDuration: "2022-2026", contactNumber: "9876543211", zomatoMobile: "9876543211", status: "verified", appliedAt: "2024-01-17", verifiedAt: "2024-01-18", ordersBeforeProgram: 3, ordersDuringProgram: 9, avgOrderValue: 198, couponUsed: true, couponCode: "STU-RAHUL-002" },
  { id: "s3", fullName: "Ananya Gupta", college: "IP University", email: "ananya@ipu.ac.in", studentIdUrl: "/mock", enrollmentDuration: "2023-2027", contactNumber: "9876543212", zomatoMobile: "9876543212", status: "pending", appliedAt: "2024-02-01", ordersBeforeProgram: 2, ordersDuringProgram: 0, avgOrderValue: 320, couponUsed: false },
  { id: "s4", fullName: "Vikash Yadav", college: "DTU", email: "vikash@dtu.ac.in", studentIdUrl: "/mock", enrollmentDuration: "2021-2025", contactNumber: "9876543213", zomatoMobile: "9876543213", status: "verified", appliedAt: "2024-01-20", verifiedAt: "2024-01-21", ordersBeforeProgram: 6, ordersDuringProgram: 14, avgOrderValue: 175, couponUsed: true, couponCode: "STU-VIKA-004", feedback: { discountValuable: true, wouldContinue: true, ordersPerMonth: 12, reasonableDiscount: 20 } },
  { id: "s5", fullName: "Sneha Patel", college: "Amity University", email: "sneha@amity.edu", studentIdUrl: "/mock", enrollmentDuration: "2023-2027", contactNumber: "9876543214", zomatoMobile: "9876543214", status: "rejected", appliedAt: "2024-01-25", ordersBeforeProgram: 1, ordersDuringProgram: 0, avgOrderValue: 410, couponUsed: false },
  { id: "s6", fullName: "Arjun Mehta", college: "NSUT", email: "arjun@nsut.ac.in", studentIdUrl: "/mock", enrollmentDuration: "2022-2026", contactNumber: "9876543215", zomatoMobile: "9876543215", status: "verified", appliedAt: "2024-01-22", verifiedAt: "2024-01-23", ordersBeforeProgram: 5, ordersDuringProgram: 8, avgOrderValue: 220, couponUsed: true, couponCode: "STU-ARJN-006" },
];

const mockPilots: PilotConfig[] = [
  { id: "p1", city: "Delhi", zone: "Dwarka", maxEligible: 1000, currentEligible: 487, discountPercent: 15, maxUsagePerDay: 1, maxUsagePerWeek: 3, couponValidityHours: 24, isActive: true, activatedAt: "2024-01-15", estimatedMargin: 28, baselineOrderFreq: 3.2, baselineAOV: 250 },
];

const mockABTests: ABTest[] = [
  {
    id: "ab1", name: "Metro Cities Pilot",
    locations: [
      { city: "Delhi - Dwarka", zone: "South-West", discount: 15, orders: 4870, revenue: 1192150, burn: 178823, retention: 72 },
      { city: "Mumbai - Andheri", zone: "West", discount: 10, orders: 3210, revenue: 867900, burn: 86790, retention: 58 },
      { city: "Bangalore - Koramangala", zone: "South", discount: 20, orders: 5640, revenue: 1297200, burn: 259440, retention: 81 },
    ],
  },
];

const mockAlerts: RiskAlert[] = [
  { id: "r1", type: "duplicate_id", studentId: "s99", studentName: "Unknown User", description: "Same student ID uploaded from 2 different accounts", timestamp: "2024-02-01T10:30:00Z", resolved: false },
  { id: "r2", type: "frequency_spike", studentId: "s4", studentName: "Vikash Yadav", description: "14 orders in 3 days - abnormal spike detected", timestamp: "2024-01-28T14:15:00Z", resolved: false },
];

interface StoreState {
  students: Student[];
  pilots: PilotConfig[];
  abTests: ABTest[];
  riskAlerts: RiskAlert[];
  currentStudentEmail: string | null;
  addStudent: (s: Omit<Student, "id" | "status" | "appliedAt" | "ordersBeforeProgram" | "ordersDuringProgram" | "avgOrderValue" | "couponUsed">) => void;
  verifyStudent: (id: string) => void;
  rejectStudent: (id: string) => void;
  suspendStudent: (id: string) => void;
  updatePilot: (id: string, updates: Partial<PilotConfig>) => void;
  togglePilot: (id: string) => void;
  resolveAlert: (id: string) => void;
  submitFeedback: (studentId: string, feedback: FeedbackData) => void;
  setCurrentStudentEmail: (email: string | null) => void;
  getMetrics: () => { totalStudents: number; verified: number; pending: number; totalOrders: number; totalRevenue: number; totalBurn: number; avgAOV: number; avgOrderLift: number; couponRedemptionRate: number; retentionRate: number };
}

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(mockStudents);
  const [pilots, setPilots] = useState<PilotConfig[]>(mockPilots);
  const [abTests] = useState<ABTest[]>(mockABTests);
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>(mockAlerts);
  const [currentStudentEmail, setCurrentStudentEmail] = useState<string | null>(null);

  const addStudent = useCallback((s: Omit<Student, "id" | "status" | "appliedAt" | "ordersBeforeProgram" | "ordersDuringProgram" | "avgOrderValue" | "couponUsed">) => {
    const newStudent: Student = {
      ...s,
      id: `s${Date.now()}`,
      status: "pending",
      appliedAt: new Date().toISOString(),
      ordersBeforeProgram: Math.floor(Math.random() * 5) + 1,
      ordersDuringProgram: 0,
      avgOrderValue: Math.floor(Math.random() * 200) + 150,
      couponUsed: false,
    };
    setStudents(prev => [...prev, newStudent]);
    setPilots(prev => prev.map(p => ({ ...p, currentEligible: p.currentEligible + 1 })));
  }, []);

  const verifyStudent = useCallback((id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: "verified" as const, verifiedAt: new Date().toISOString(), couponCode: `STU-${s.fullName.slice(0, 4).toUpperCase()}-${Date.now().toString().slice(-3)}` } : s));
  }, []);

  const rejectStudent = useCallback((id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: "rejected" as const } : s));
  }, []);

  const suspendStudent = useCallback((id: string) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, status: "suspended" as const } : s));
  }, []);

  const updatePilot = useCallback((id: string, updates: Partial<PilotConfig>) => {
    setPilots(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const togglePilot = useCallback((id: string) => {
    setPilots(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p));
  }, []);

  const resolveAlert = useCallback((id: string) => {
    setRiskAlerts(prev => prev.map(a => a.id === id ? { ...a, resolved: true } : a));
  }, []);

  const submitFeedback = useCallback((studentId: string, feedback: FeedbackData) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, feedback } : s));
  }, []);

  const getMetrics = useCallback(() => {
    const verified = students.filter(s => s.status === "verified");
    const totalOrders = verified.reduce((a, s) => a + s.ordersDuringProgram, 0);
    const totalRevenue = verified.reduce((a, s) => a + s.ordersDuringProgram * s.avgOrderValue, 0);
    const discount = pilots[0]?.discountPercent || 15;
    const totalBurn = totalRevenue * (discount / 100);
    const avgAOV = verified.length ? verified.reduce((a, s) => a + s.avgOrderValue, 0) / verified.length : 0;
    const avgOrderLift = verified.length ? verified.reduce((a, s) => a + (s.ordersDuringProgram - s.ordersBeforeProgram), 0) / verified.length : 0;
    const couponRedemptionRate = verified.length ? (verified.filter(s => s.couponUsed).length / verified.length) * 100 : 0;
    const retentionRate = verified.length ? (verified.filter(s => s.ordersDuringProgram > s.ordersBeforeProgram).length / verified.length) * 100 : 0;

    return {
      totalStudents: students.length,
      verified: verified.length,
      pending: students.filter(s => s.status === "pending").length,
      totalOrders,
      totalRevenue,
      totalBurn,
      avgAOV,
      avgOrderLift,
      couponRedemptionRate,
      retentionRate,
    };
  }, [students, pilots]);

  return (
    <StoreContext.Provider value={{ students, pilots, abTests, riskAlerts, currentStudentEmail, addStudent, verifyStudent, rejectStudent, suspendStudent, updatePilot, togglePilot, resolveAlert, submitFeedback, setCurrentStudentEmail, getMetrics }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
