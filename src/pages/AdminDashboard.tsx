import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, TrendingUp, ShieldAlert, FlaskConical, Settings, CheckCircle2, XCircle, Pause, Download, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useToast } from "@/hooks/use-toast";
import MobileLayout from "@/components/MobileLayout";

export default function AdminDashboard() {
  const { students, pilots, abTests, riskAlerts, verifyStudent, rejectStudent, suspendStudent, updatePilot, togglePilot, resolveAlert, getMetrics } = useStore();
  const { toast } = useToast();
  const metrics = getMetrics();
  const pilot = pilots[0];

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
    <MobileLayout>
      {/* Admin Header */}
      <div className="bg-gradient-dark text-primary-foreground px-5 pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold">Admin Console</h1>
            <p className="text-[11px] opacity-70">Pilot Control Center</p>
          </div>
          <Badge variant={pilot.isActive ? "default" : "destructive"} className="text-[10px] h-6">
            {pilot.isActive ? "🟢 Active" : "🔴 Paused"}
          </Badge>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="bg-card border-b border-border px-5 py-3">
        <div className="flex overflow-x-auto gap-5 no-scrollbar">
          {[
            { label: "Students", value: metrics.totalStudents },
            { label: "Verified", value: metrics.verified },
            { label: "Redemption", value: `${metrics.couponRedemptionRate.toFixed(0)}%` },
            { label: "Order Lift", value: `+${metrics.avgOrderLift.toFixed(1)}` },
            { label: "Retention", value: `${metrics.retentionRate.toFixed(0)}%` },
          ].map((kpi) => (
            <div key={kpi.label} className="text-center shrink-0">
              <p className="text-lg font-extrabold">{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground whitespace-nowrap">{kpi.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-4">
        <Tabs defaultValue="students" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 h-10 rounded-xl">
            <TabsTrigger value="students" className="text-[10px] px-1 rounded-lg"><Users className="w-3.5 h-3.5" /></TabsTrigger>
            <TabsTrigger value="controls" className="text-[10px] px-1 rounded-lg"><Settings className="w-3.5 h-3.5" /></TabsTrigger>
            <TabsTrigger value="analytics" className="text-[10px] px-1 rounded-lg"><TrendingUp className="w-3.5 h-3.5" /></TabsTrigger>
            <TabsTrigger value="ab" className="text-[10px] px-1 rounded-lg"><FlaskConical className="w-3.5 h-3.5" /></TabsTrigger>
            <TabsTrigger value="risk" className="text-[10px] px-1 rounded-lg"><ShieldAlert className="w-3.5 h-3.5" /></TabsTrigger>
          </TabsList>

          {/* STUDENTS */}
          <TabsContent value="students" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Applications</h2>
              <Button variant="outline" size="sm" className="h-7 text-[11px] rounded-lg"><Download className="w-3 h-3 mr-1" /> Export</Button>
            </div>
            {students.map(s => (
              <motion.div key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-2xl p-4 border border-border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-sm">{s.fullName}</p>
                    <p className="text-[11px] text-muted-foreground">{s.college}</p>
                    <p className="text-[10px] text-muted-foreground">{s.email}</p>
                  </div>
                  <Badge variant={s.status === "verified" ? "default" : s.status === "pending" ? "secondary" : "destructive"} className="text-[10px]">
                    {s.status}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-3">
                  {s.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => { verifyStudent(s.id); toast({ title: `${s.fullName} verified` }); }} className="h-8 text-[11px] rounded-lg bg-success hover:bg-success/90 text-success-foreground flex-1">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Verify
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => { rejectStudent(s.id); toast({ title: `${s.fullName} rejected` }); }} className="h-8 text-[11px] rounded-lg flex-1">
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Reject
                      </Button>
                    </>
                  )}
                  {s.status === "verified" && (
                    <Button size="sm" variant="outline" onClick={() => { suspendStudent(s.id); toast({ title: `${s.fullName} suspended` }); }} className="h-8 text-[11px] rounded-lg text-warning">
                      <Pause className="w-3.5 h-3.5 mr-1" /> Suspend
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </TabsContent>

          {/* CONTROLS */}
          <TabsContent value="controls" className="space-y-4">
            <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
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

            <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
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
            <div className="bg-card rounded-2xl p-5 border border-border space-y-4">
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
          </TabsContent>

          {/* ANALYTICS */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="bg-card rounded-2xl p-4 border border-border">
              <h3 className="font-bold text-sm mb-3">Orders: Before vs During</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={orderComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="before" fill="hsl(var(--muted-foreground))" name="Before" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="during" fill="hsl(var(--primary))" name="During" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card rounded-2xl p-4 border border-border space-y-3">
              <h3 className="font-bold text-sm">Financial Summary</h3>
              {[
                { label: "Total Revenue", value: `₹${metrics.totalRevenue.toLocaleString()}` },
                { label: "Total Burn", value: `₹${Math.round(metrics.totalBurn).toLocaleString()}` },
                { label: "Net Impact", value: `₹${Math.round(metrics.totalRevenue - metrics.totalBurn).toLocaleString()}` },
                { label: "Avg Order Value", value: `₹${Math.round(metrics.avgAOV)}` },
                { label: "Cost/Student", value: `₹${metrics.verified ? Math.round(metrics.totalBurn / metrics.verified) : 0}` },
              ].map(item => (
                <div key={item.label} className="flex justify-between py-1.5 border-b border-border last:border-0">
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                  <span className="text-xs font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* A/B TESTS */}
          <TabsContent value="ab" className="space-y-4">
            <h2 className="text-sm font-bold">{abTests[0]?.name}</h2>
            <div className="bg-card rounded-2xl p-4 border border-border">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={abChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: 10 }} />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" name="Revenue ₹K" radius={[3, 3, 0, 0]} />
                  <Bar dataKey="burn" fill="hsl(var(--destructive))" name="Burn ₹K" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {abTests[0]?.locations.map(loc => (
              <div key={loc.city} className="bg-card rounded-2xl p-4 border border-border">
                <h4 className="font-bold text-sm mb-2">{loc.city}</h4>
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span className="font-medium">{loc.discount}%</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Orders</span><span className="font-medium">{loc.orders.toLocaleString()}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Revenue</span><span className="font-medium">₹{(loc.revenue / 1000).toFixed(0)}K</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Burn</span><span className="font-medium text-destructive">₹{(loc.burn / 1000).toFixed(0)}K</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">Retention</span><span className="font-bold">{loc.retention}%</span></div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* RISK */}
          <TabsContent value="risk" className="space-y-3">
            <h2 className="text-sm font-bold">Risk Alerts</h2>
            {riskAlerts.map(alert => (
              <motion.div key={alert.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`bg-card rounded-2xl p-4 border ${alert.resolved ? "border-border opacity-60" : "border-destructive/30"}`}>
                <div className="flex items-start gap-3">
                  <ShieldAlert className={`w-4 h-4 mt-0.5 shrink-0 ${alert.resolved ? "text-muted-foreground" : "text-destructive"}`} />
                  <div className="flex-1">
                    <p className="font-medium text-xs">{alert.description}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{alert.studentName} · {new Date(alert.timestamp).toLocaleString()}</p>
                    <Badge variant="outline" className="text-[9px] mt-1.5">{alert.type.replace("_", " ")}</Badge>
                  </div>
                </div>
                {!alert.resolved && (
                  <Button size="sm" variant="outline" onClick={() => { resolveAlert(alert.id); toast({ title: "Alert resolved" }); }} className="w-full mt-3 h-8 text-[11px] rounded-lg">
                    Resolve
                  </Button>
                )}
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </MobileLayout>
  );
}
