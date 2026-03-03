import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Users, TrendingUp, ShieldAlert, FlaskConical, Settings, CheckCircle2, XCircle, Pause, Download, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { students, pilots, abTests, riskAlerts, verifyStudent, rejectStudent, suspendStudent, updatePilot, togglePilot, resolveAlert, getMetrics } = useStore();
  const { toast } = useToast();
  const metrics = getMetrics();
  const pilot = pilots[0];

  // Guesstimate state
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

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-gradient-dark text-primary-foreground py-6">
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/")} variant="ghost" size="icon" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold">Student Program Admin</h1>
              <p className="text-sm opacity-70">Pilot Control Center</p>
            </div>
          </div>
          <Badge variant={pilot.isActive ? "default" : "destructive"} className="text-sm">
            {pilot.isActive ? "🟢 Active" : "🔴 Paused"}
          </Badge>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="bg-card border-b border-border">
        <div className="container py-4 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: "Total Students", value: metrics.totalStudents, icon: Users },
            { label: "Verified", value: metrics.verified, icon: CheckCircle2 },
            { label: "Coupon Redemption", value: `${metrics.couponRedemptionRate.toFixed(0)}%`, icon: TrendingUp },
            { label: "Avg Order Lift", value: `+${metrics.avgOrderLift.toFixed(1)}`, icon: BarChart3 },
            { label: "Retention", value: `${metrics.retentionRate.toFixed(0)}%`, icon: TrendingUp },
          ].map((kpi, i) => (
            <motion.div key={kpi.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="text-center">
              <p className="text-2xl font-extrabold">{kpi.value}</p>
              <p className="text-xs text-muted-foreground">{kpi.label}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="container py-6">
        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 h-auto">
            <TabsTrigger value="students" className="gap-1.5 text-xs md:text-sm py-2.5"><Users className="w-4 h-4 hidden md:block" /> Students</TabsTrigger>
            <TabsTrigger value="controls" className="gap-1.5 text-xs md:text-sm py-2.5"><Settings className="w-4 h-4 hidden md:block" /> Controls</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5 text-xs md:text-sm py-2.5"><TrendingUp className="w-4 h-4 hidden md:block" /> Analytics</TabsTrigger>
            <TabsTrigger value="ab" className="gap-1.5 text-xs md:text-sm py-2.5"><FlaskConical className="w-4 h-4 hidden md:block" /> A/B Tests</TabsTrigger>
            <TabsTrigger value="risk" className="gap-1.5 text-xs md:text-sm py-2.5"><ShieldAlert className="w-4 h-4 hidden md:block" /> Risk</TabsTrigger>
          </TabsList>

          {/* STUDENTS TAB */}
          <TabsContent value="students" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Student Applications</h2>
              <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-1" /> Export CSV</Button>
            </div>
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-secondary text-secondary-foreground">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Name</th>
                      <th className="px-4 py-3 text-left font-semibold">College</th>
                      <th className="px-4 py-3 text-left font-semibold">Email</th>
                      <th className="px-4 py-3 text-center font-semibold">Status</th>
                      <th className="px-4 py-3 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {students.map(s => (
                      <tr key={s.id} className="hover:bg-muted/50">
                        <td className="px-4 py-3 font-medium">{s.fullName}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.college}</td>
                        <td className="px-4 py-3 text-muted-foreground">{s.email}</td>
                        <td className="px-4 py-3 text-center">
                          <Badge variant={s.status === "verified" ? "default" : s.status === "pending" ? "secondary" : "destructive"} className="text-xs">
                            {s.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-center gap-1">
                            {s.status === "pending" && (
                              <>
                                <Button size="sm" variant="ghost" onClick={() => { verifyStudent(s.id); toast({ title: `${s.fullName} verified` }); }} className="text-success hover:text-success h-7 px-2"><CheckCircle2 className="w-4 h-4" /></Button>
                                <Button size="sm" variant="ghost" onClick={() => { rejectStudent(s.id); toast({ title: `${s.fullName} rejected` }); }} className="text-destructive hover:text-destructive h-7 px-2"><XCircle className="w-4 h-4" /></Button>
                              </>
                            )}
                            {s.status === "verified" && (
                              <Button size="sm" variant="ghost" onClick={() => { suspendStudent(s.id); toast({ title: `${s.fullName} suspended` }); }} className="text-warning hover:text-warning h-7 px-2"><Pause className="w-4 h-4" /></Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* CONTROLS TAB */}
          <TabsContent value="controls" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl p-6 border border-border space-y-5">
                <h3 className="font-bold text-lg">Pilot Configuration</h3>
                <div className="flex items-center justify-between">
                  <Label>Program Active</Label>
                  <Switch checked={pilot.isActive} onCheckedChange={() => togglePilot(pilot.id)} />
                </div>
                <div>
                  <Label>City</Label>
                  <Select value={pilot.city} onValueChange={v => updatePilot(pilot.id, { city: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Delhi", "Mumbai", "Bangalore", "Hyderabad", "Chennai", "Pune"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Zone</Label>
                  <Input value={pilot.zone} onChange={e => updatePilot(pilot.id, { zone: e.target.value })} />
                </div>
                <div>
                  <Label>Max Eligible Students: {pilot.maxEligible}</Label>
                  <Slider value={[pilot.maxEligible]} onValueChange={([v]) => updatePilot(pilot.id, { maxEligible: v })} min={100} max={10000} step={100} className="mt-2" />
                </div>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border space-y-5">
                <h3 className="font-bold text-lg">Burn Controls</h3>
                <div>
                  <Label>Discount %: {pilot.discountPercent}%</Label>
                  <Slider value={[pilot.discountPercent]} onValueChange={([v]) => updatePilot(pilot.id, { discountPercent: v })} min={5} max={30} step={1} className="mt-2" />
                </div>
                <div>
                  <Label>Max Usage / Day: {pilot.maxUsagePerDay}</Label>
                  <Slider value={[pilot.maxUsagePerDay]} onValueChange={([v]) => updatePilot(pilot.id, { maxUsagePerDay: v })} min={1} max={5} step={1} className="mt-2" />
                </div>
                <div>
                  <Label>Max Usage / Week: {pilot.maxUsagePerWeek}</Label>
                  <Slider value={[pilot.maxUsagePerWeek]} onValueChange={([v]) => updatePilot(pilot.id, { maxUsagePerWeek: v })} min={1} max={14} step={1} className="mt-2" />
                </div>
                <div>
                  <Label>Coupon Validity (hours): {pilot.couponValidityHours}</Label>
                  <Slider value={[pilot.couponValidityHours]} onValueChange={([v]) => updatePilot(pilot.id, { couponValidityHours: v })} min={1} max={72} step={1} className="mt-2" />
                </div>
              </div>
            </div>

            {/* Guesstimate */}
            <div className="bg-card rounded-xl p-6 border border-border space-y-5">
              <h3 className="font-bold text-lg">📊 Guesstimate Model</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <Label>Baseline Order Freq: {guesstimate.baselineFreq}</Label>
                  <Slider value={[guesstimate.baselineFreq]} onValueChange={([v]) => setGuesstimate(g => ({ ...g, baselineFreq: v }))} min={1} max={15} step={0.1} className="mt-2" />
                </div>
                <div>
                  <Label>Avg Order Value: ₹{guesstimate.avgOrderValue}</Label>
                  <Slider value={[guesstimate.avgOrderValue]} onValueChange={([v]) => setGuesstimate(g => ({ ...g, avgOrderValue: v }))} min={100} max={600} step={10} className="mt-2" />
                </div>
                <div>
                  <Label>Discount %: {guesstimate.discountPerOrder}%</Label>
                  <Slider value={[guesstimate.discountPerOrder]} onValueChange={([v]) => setGuesstimate(g => ({ ...g, discountPerOrder: v }))} min={5} max={30} step={1} className="mt-2" />
                </div>
                <div>
                  <Label>Margin %: {guesstimate.margin}%</Label>
                  <Slider value={[guesstimate.margin]} onValueChange={([v]) => setGuesstimate(g => ({ ...g, margin: v }))} min={10} max={50} step={1} className="mt-2" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-foreground">₹{(projectedRevenue / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-muted-foreground">Projected Revenue/yr</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-extrabold text-destructive">₹{(projectedBurn / 100000).toFixed(1)}L</p>
                  <p className="text-xs text-muted-foreground">Projected Burn/yr</p>
                </div>
                <div className="text-center">
                  <p className={`text-2xl font-extrabold ${projectedProfit > 0 ? "text-success" : "text-destructive"}`}>
                    {projectedProfit > 0 ? "+" : ""}₹{(projectedProfit / 100000).toFixed(1)}L
                  </p>
                  <p className="text-xs text-muted-foreground">Net Gain/Loss/yr</p>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ANALYTICS TAB */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-bold mb-4">Order Comparison (Before vs During)</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={orderComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="before" fill="hsl(var(--muted-foreground))" name="Before" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="during" fill="hsl(var(--primary))" name="During Program" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-card rounded-xl p-6 border border-border">
                <h3 className="font-bold mb-4">Financial Summary</h3>
                <div className="space-y-4">
                  {[
                    { label: "Total Revenue", value: `₹${metrics.totalRevenue.toLocaleString()}`, sub: "From verified student orders" },
                    { label: "Total Burn", value: `₹${Math.round(metrics.totalBurn).toLocaleString()}`, sub: `At ${pilot.discountPercent}% discount rate` },
                    { label: "Net Impact", value: `₹${Math.round(metrics.totalRevenue - metrics.totalBurn).toLocaleString()}`, sub: "Revenue minus coupon burn" },
                    { label: "Avg Order Value", value: `₹${Math.round(metrics.avgAOV)}`, sub: "Across all verified students" },
                    { label: "Cost per Student", value: `₹${metrics.verified ? Math.round(metrics.totalBurn / metrics.verified) : 0}`, sub: "Average discount burn per student" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-sm">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.sub}</p>
                      </div>
                      <p className="font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* A/B TESTS TAB */}
          <TabsContent value="ab" className="space-y-6">
            <h2 className="text-lg font-bold">A/B Test: {abTests[0]?.name}</h2>
            <div className="bg-card rounded-xl p-6 border border-border">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={abChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue (₹K)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="burn" fill="hsl(var(--destructive))" name="Burn (₹K)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {abTests[0]?.locations.map(loc => (
                <div key={loc.city} className="bg-card rounded-xl p-5 border border-border">
                  <h4 className="font-bold mb-3">{loc.city}</h4>
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
          </TabsContent>

          {/* RISK TAB */}
          <TabsContent value="risk" className="space-y-4">
            <h2 className="text-lg font-bold">Risk Alerts</h2>
            {riskAlerts.map(alert => (
              <motion.div key={alert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`bg-card rounded-xl p-5 border ${alert.resolved ? "border-border opacity-60" : "border-destructive/30"} flex items-start justify-between gap-4`}>
                <div className="flex items-start gap-3">
                  <ShieldAlert className={`w-5 h-5 mt-0.5 ${alert.resolved ? "text-muted-foreground" : "text-destructive"}`} />
                  <div>
                    <p className="font-medium text-sm">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{alert.studentName} · {new Date(alert.timestamp).toLocaleString()}</p>
                    <Badge variant="outline" className="text-xs mt-2">{alert.type.replace("_", " ")}</Badge>
                  </div>
                </div>
                {!alert.resolved && (
                  <Button size="sm" variant="outline" onClick={() => { resolveAlert(alert.id); toast({ title: "Alert resolved" }); }}>Resolve</Button>
                )}
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
