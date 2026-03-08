import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useStudentApplications, useUpdateStudentStatus } from "@/hooks/use-student-applications";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, TrendingUp, ShieldAlert, CheckCircle2, XCircle, Pause, Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminDashboard() {
  const { students, pilots, abTests, riskAlerts, updatePilot, togglePilot, resolveAlert, getMetrics } = useStore();
  const { data: supabaseStudents, isLoading: studentsLoading } = useStudentApplications();
  const updateStatus = useUpdateStudentStatus();
  const { toast } = useToast();
  const metrics = getMetrics();
  const pilot = pilots[0];
  const [activeTab, setActiveTab] = useState("students");

  const [guesstimate, setGuesstimate] = useState({
    baselineFreq: pilot.baselineOrderFreq,
    avgOrderValue: pilot.baselineAOV,
    discountPerOrder: pilot.discountPercent,
    margin: pilot.estimatedMargin,
    totalStudents: 1000,
  });

  const projectedRevenue = guesstimate.totalStudents * guesstimate.baselineFreq * 1.4 * guesstimate.avgOrderValue * 12;
  const projectedBurn = projectedRevenue * (guesstimate.discountPerOrder / 100);
  const projectedProfit = projectedRevenue * (guesstimate.margin / 100) - projectedBurn;

  const orderComparisonData = students.filter(s => s.status === "verified").map(s => ({
    name: s.fullName.split(" ")[0],
    before: s.ordersBeforeProgram,
    during: s.ordersDuringProgram,
  }));

  const abChartData = abTests[0]?.locations.map(l => ({
    name: l.city.split(" - ")[0],
    revenue: Math.round(l.revenue / 1000),
    burn: Math.round(l.burn / 1000),
    retention: l.retention,
  }));

  const kpis = [
    { label: "Total Students", value: metrics.totalStudents, icon: Users },
    { label: "Verified", value: metrics.verified, icon: CheckCircle2 },
    { label: "Redemption Rate", value: `${metrics.couponRedemptionRate.toFixed(0)}%`, icon: TrendingUp },
    { label: "Avg Order Lift", value: `+${metrics.avgOrderLift.toFixed(1)}`, icon: TrendingUp },
    { label: "Retention", value: `${metrics.retentionRate.toFixed(0)}%`, icon: ShieldAlert },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} pilotActive={pilot.isActive} />

      <div className="flex-1 overflow-y-auto">
        {/* KPI Strip */}
        <div className="border-b border-border bg-card px-8 py-5">
          <div className="grid grid-cols-5 gap-6">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-extrabold leading-none">{kpi.value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{kpi.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* STUDENTS */}
          {activeTab === "students" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Student Applications</h2>
                <Button variant="outline" size="sm" className="rounded-lg"><Download className="w-4 h-4 mr-2" /> Export</Button>
              </div>
              {studentsLoading ? (
                <p className="text-sm text-muted-foreground">Loading student applications...</p>
              ) : !supabaseStudents?.length ? (
                <p className="text-sm text-muted-foreground">No student applications found.</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {supabaseStudents.map(s => (
                    <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl p-5 border border-border">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-sm">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.college_name}</p>
                          <p className="text-xs text-muted-foreground">{s.university_email}</p>
                        </div>
                        <Badge variant="secondary" className="text-[11px]">
                          {s.status || "pending"}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
                        <span>Student ID: {s.student_id}</span>
                        <span>Enrollment: {s.enrollment_duration}</span>
                        <span>Contact: {s.contact_number}</span>
                        <span>Zomato: {s.zomato_mobile}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-2">Applied: {new Date(s.created_at).toLocaleDateString()}</p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-xs rounded-lg"
                          disabled={s.status === "verified" || updateStatus.isPending}
                          onClick={() => {
                            updateStatus.mutate({ id: s.id, status: "verified" }, {
                              onSuccess: () => toast({ title: "Student verified" }),
                              onError: () => toast({ title: "Failed to verify", variant: "destructive" }),
                            });
                          }}
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Verify
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-xs rounded-lg"
                          disabled={s.status === "rejected" || updateStatus.isPending}
                          onClick={() => {
                            updateStatus.mutate({ id: s.id, status: "rejected" }, {
                              onSuccess: () => toast({ title: "Student rejected" }),
                              onError: () => toast({ title: "Failed to reject", variant: "destructive" }),
                            });
                          }}
                        >
                          <XCircle className="w-3 h-3 mr-1" /> Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-8 text-xs rounded-lg"
                          disabled={s.status === "suspended" || updateStatus.isPending}
                          onClick={() => {
                            updateStatus.mutate({ id: s.id, status: "suspended" }, {
                              onSuccess: () => toast({ title: "Student suspended" }),
                              onError: () => toast({ title: "Failed to suspend", variant: "destructive" }),
                            });
                          }}
                        >
                          <Pause className="w-3 h-3 mr-1" /> Suspend
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CONTROLS */}
          {activeTab === "controls" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Pilot Controls</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Pilot Config */}
                <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                  <h3 className="font-bold text-sm">Pilot Config</h3>
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Program Active</Label>
                    <Switch checked={pilot.isActive} onCheckedChange={() => togglePilot(pilot.id)} />
                  </div>
                  <div>
                    <Label className="text-xs">City</Label>
                    <Select value={pilot.city} onValueChange={v => updatePilot(pilot.id, { city: v })}>
                      <SelectTrigger className="mt-1 h-10 rounded-xl text-xs"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs">Zone</Label>
                    <Input value={pilot.zone} onChange={e => updatePilot(pilot.id, { zone: e.target.value })} className="mt-1 h-10 rounded-xl text-xs" />
                  </div>
                  <div>
                    <Label className="text-xs">Max Eligible: {pilot.maxEligible}</Label>
                    <Slider value={[pilot.maxEligible]} onValueChange={([v]) => updatePilot(pilot.id, { maxEligible: v })} min={100} max={10000} step={100} className="mt-2" />
                  </div>
                </div>

                {/* Burn Controls */}
                <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                  <h3 className="font-bold text-sm">Burn Controls</h3>
                  <div>
                    <Label className="text-xs">Discount: {pilot.discountPercent}%</Label>
                    <Slider value={[pilot.discountPercent]} onValueChange={([v]) => updatePilot(pilot.id, { discountPercent: v })} min={5} max={30} step={1} className="mt-2" />
                  </div>
                  <div>
                    <Label className="text-xs">Max Usage/Day: {pilot.maxUsagePerDay}</Label>
                    <Slider value={[pilot.maxUsagePerDay]} onValueChange={([v]) => updatePilot(pilot.id, { maxUsagePerDay: v })} min={1} max={5} step={1} className="mt-2" />
                  </div>
                  <div>
                    <Label className="text-xs">Max Usage/Week: {pilot.maxUsagePerWeek}</Label>
                    <Slider value={[pilot.maxUsagePerWeek]} onValueChange={([v]) => updatePilot(pilot.id, { maxUsagePerWeek: v })} min={1} max={14} step={1} className="mt-2" />
                  </div>
                  <div>
                    <Label className="text-xs">Coupon Validity: {pilot.couponValidityHours}h</Label>
                    <Slider value={[pilot.couponValidityHours]} onValueChange={([v]) => updatePilot(pilot.id, { couponValidityHours: v })} min={1} max={72} step={1} className="mt-2" />
                  </div>
                </div>

                {/* Guesstimate */}
                <div className="bg-card rounded-2xl p-6 border border-border space-y-4">
                  <h3 className="font-bold text-sm">📊 Guesstimate Model</h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Baseline Freq: {guesstimate.baselineFreq}</Label>
                      <Slider value={[guesstimate.baselineFreq]} onValueChange={([v]) => setGuesstimate(g => ({ ...g, baselineFreq: v }))} min={1} max={15} step={0.1} className="mt-2" />
                    </div>
                    <div>
                      <Label className="text-xs">AOV: ₹{guesstimate.avgOrderValue}</Label>
                      <Slider value={[guesstimate.avgOrderValue]} onValueChange={([v]) => setGuesstimate(g => ({ ...g, avgOrderValue: v }))} min={100} max={600} step={10} className="mt-2" />
                    </div>
                    <div>
                      <Label className="text-xs">Discount: {guesstimate.discountPerOrder}%</Label>
                      <Slider value={[guesstimate.discountPerOrder]} onValueChange={([v]) => setGuesstimate(g => ({ ...g, discountPerOrder: v }))} min={5} max={30} step={1} className="mt-2" />
                    </div>
                    <div>
                      <Label className="text-xs">Margin: {guesstimate.margin}%</Label>
                      <Slider value={[guesstimate.margin]} onValueChange={([v]) => setGuesstimate(g => ({ ...g, margin: v }))} min={10} max={50} step={1} className="mt-2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                    <div className="text-center">
                      <p className="text-base font-extrabold">₹{(projectedRevenue / 100000).toFixed(1)}L</p>
                      <p className="text-[9px] text-muted-foreground">Revenue/yr</p>
                    </div>
                    <div className="text-center">
                      <p className="text-base font-extrabold text-destructive">₹{(projectedBurn / 100000).toFixed(1)}L</p>
                      <p className="text-[9px] text-muted-foreground">Burn/yr</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-base font-extrabold ${projectedProfit > 0 ? "text-success" : "text-destructive"}`}>
                        {projectedProfit > 0 ? "+" : ""}₹{(projectedProfit / 100000).toFixed(1)}L
                      </p>
                      <p className="text-[9px] text-muted-foreground">Net/yr</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeTab === "analytics" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Analytics</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="bg-card rounded-2xl p-6 border border-border">
                  <h3 className="font-bold text-sm mb-4">Orders: Before vs During</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={orderComparisonData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Legend wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="before" fill="hsl(var(--muted-foreground))" name="Before" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="during" fill="hsl(var(--primary))" name="During" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-card rounded-2xl p-6 border border-border space-y-3">
                  <h3 className="font-bold text-sm">Financial Summary</h3>
                  {[
                    { label: "Total Revenue", value: `₹${metrics.totalRevenue.toLocaleString()}` },
                    { label: "Total Burn", value: `₹${Math.round(metrics.totalBurn).toLocaleString()}` },
                    { label: "Net Impact", value: `₹${Math.round(metrics.totalRevenue - metrics.totalBurn).toLocaleString()}` },
                    { label: "Avg Order Value", value: `₹${Math.round(metrics.avgAOV)}` },
                    { label: "Cost/Student", value: `₹${metrics.verified ? Math.round(metrics.totalBurn / metrics.verified) : 0}` },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-sm text-muted-foreground">{item.label}</span>
                      <span className="text-sm font-bold">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* A/B TESTS */}
          {activeTab === "ab" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">{abTests[0]?.name}</h2>
              <div className="bg-card rounded-2xl p-6 border border-border">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={abChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={11} />
                    <YAxis fontSize={11} />
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ₹K" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="burn" fill="hsl(var(--destructive))" name="Burn ₹K" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {abTests[0]?.locations.map(loc => (
                  <div key={loc.city} className="bg-card rounded-2xl p-5 border border-border">
                    <h4 className="font-bold text-sm mb-3">{loc.city}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-medium">{loc.discount}%</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Orders</span><span className="font-medium">{loc.orders.toLocaleString()}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="font-medium">₹{(loc.revenue / 1000).toFixed(0)}K</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Burn</span><span className="font-medium text-destructive">₹{(loc.burn / 1000).toFixed(0)}K</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Retention</span><span className="font-bold">{loc.retention}%</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* RISK */}
          {activeTab === "risk" && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Risk Alerts</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {riskAlerts.map(alert => (
                  <motion.div key={alert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`bg-card rounded-2xl p-5 border ${alert.resolved ? "border-border opacity-60" : "border-destructive/30"}`}>
                    <div className="flex items-start gap-3">
                      <ShieldAlert className={`w-4 h-4 mt-0.5 shrink-0 ${alert.resolved ? "text-muted-foreground" : "text-destructive"}`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{alert.studentName} · {new Date(alert.timestamp).toLocaleString()}</p>
                        <Badge variant="outline" className="text-[10px] mt-1.5">{alert.type.replace("_", " ")}</Badge>
                      </div>
                    </div>
                    {!alert.resolved && (
                      <Button size="sm" variant="outline" onClick={() => { resolveAlert(alert.id); toast({ title: "Alert resolved" }); }} className="w-full mt-3 h-8 text-xs rounded-lg">
                        Resolve
                      </Button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
