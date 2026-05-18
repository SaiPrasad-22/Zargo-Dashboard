import { Link } from "react-router-dom";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Bike, CalendarDays, Battery, DollarSign, Bell, AlertTriangle, Zap, Users, Plus, FileCheck, BellPlus, Activity, Wrench, CreditCard } from "lucide-react";
import { useDashboardStats } from "@/hooks/useDashboard";
import { useBookings } from "@/hooks/useBookings";
import { useAlerts } from "@/hooks/useAlerts";
import { StatCardsSkeleton, TableSkeleton } from "@/components/states/LoadingSkeleton";
import { ErrorState } from "@/components/states/ErrorState";

const Dashboard = () => {
  const statsQ = useDashboardStats();
  const bookingsQ = useBookings();
  const alertsQ = useAlerts();

  const stats = statsQ.data;
  const bookings = bookingsQ.data ?? [];
  const alerts = alertsQ.data ?? [];

  const activeBookings = bookings.filter((b) => b.status !== "completed");

  const quickActions = [
    { to: "/vehicles", label: "Add Vehicle", icon: Plus, color: "text-primary bg-primary/10" },
    { to: "/bookings", label: "Create Booking", icon: CalendarDays, color: "text-accent bg-accent/10" },
    { to: "/employees", label: "Start KYC", icon: FileCheck, color: "text-warning bg-warning/10" },
    { to: "/alerts", label: "Create Alert", icon: BellPlus, color: "text-destructive bg-destructive/10" },
  ];

  const activity = [
    { icon: Bike, color: "text-primary bg-primary/10", text: "Rahul assigned vehicle V003", time: "2m ago" },
    { icon: CreditCard, color: "text-accent bg-accent/10", text: "Payment received from Priya Reddy", time: "18m ago" },
    { icon: Wrench, color: "text-warning bg-warning/10", text: "Vehicle V006 moved to service", time: "1h ago" },
    { icon: CalendarDays, color: "text-primary bg-primary/10", text: "New booking ZRG-105 created", time: "3h ago" },
    { icon: AlertTriangle, color: "text-destructive bg-destructive/10", text: "Overdue alert raised – Ankit Mehra", time: "5h ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Operations Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Real-time overview of your EV fleet</p>
      </div>

      {statsQ.isLoading || !stats ? (
        <StatCardsSkeleton count={8} />
      ) : statsQ.error ? (
        <ErrorState message="Failed to load stats" onRetry={() => statsQ.refetch()} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Vehicles" value={stats.totalVehicles} icon={Bike} subtitle="+2 added this month" />
          <StatCard title="Active Rentals" value={stats.activeRentals} icon={CalendarDays} accent="primary" subtitle="Across all hubs" />
          <StatCard title="Available" value={stats.availableVehicles} icon={Battery} accent="success" subtitle="Ready to deploy" />
          <StatCard title="Revenue" value={stats.revenue} icon={DollarSign} accent="accent" subtitle="This month" />
          <StatCard title="Overdue Vehicles" value={stats.overdueVehicles} icon={AlertTriangle} accent="destructive" subtitle="Need attention" />
          <StatCard title="Deployed" value={stats.deployedVehicles} icon={Zap} accent="primary" subtitle="On the road" />
          <StatCard title="Total Customers" value={stats.totalCustomers} icon={Users} accent="accent" subtitle="Unique riders" />
          <StatCard title="Unread Alerts" value={stats.unreadAlerts} icon={Bell} accent="warning" subtitle="Requires action" />
        </div>
      )}

      <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5">
        <h2 className="font-semibold mb-4 flex items-center gap-2"><Zap size={16} className="text-primary" /> Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {quickActions.map((a) => (
            <Link key={a.label} to={a.to} className="group flex items-center gap-3 p-3 rounded-lg border border-border/60 hover:border-primary/40 hover:bg-muted/40 transition-all">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${a.color}`}>
                <a.icon size={16} />
              </div>
              <span className="text-sm font-medium group-hover:text-primary transition-colors">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card rounded-xl border border-border/60 shadow-sm">
          <div className="p-5 border-b flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Active Bookings</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Live rental status across the fleet</p>
            </div>
            <Link to="/bookings" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          <div className="overflow-x-auto max-h-[440px]">
            {bookingsQ.isLoading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : (
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-muted/60 backdrop-blur z-10">
                <tr className="border-b">
                  {["Booking", "Rider", "Vehicle", "End Date", "KM", "Status"].map((h) => (
                    <th key={h} className="text-left px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {activeBookings.map((b) => (
                  <tr key={b.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-3 font-medium whitespace-nowrap text-primary">{b.id}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <div className="font-medium">{b.rider_name}</div>
                      <div className="text-xs text-muted-foreground">{b.phone}</div>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap">{b.vehicle_id}</td>
                    <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{b.end_date}</td>
                    <td className="px-5 py-3 whitespace-nowrap">
                      <span className={b.current_km > b.allowed_km ? "text-destructive font-semibold" : ""}>{b.current_km}</span>
                      <span className="text-muted-foreground">/{b.allowed_km}</span>
                    </td>
                    <td className="px-5 py-3 whitespace-nowrap"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            )}
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border/60 shadow-sm">
          <div className="p-5 border-b">
            <h2 className="font-semibold flex items-center gap-2"><Activity size={16} className="text-primary" /> Recent Activity</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Latest events from your fleet</p>
          </div>
          <div className="divide-y">
            {activity.map((a, i) => (
              <div key={i} className="px-5 py-3 flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.color}`}>
                  <a.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{a.text}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/60 shadow-sm">
        <div className="p-5 border-b">
          <h2 className="font-semibold flex items-center gap-2"><Bell size={16} className="text-primary" /> Latest Alerts</h2>
        </div>
        <div className="divide-y">
          {alerts.slice(0, 5).map((a) => (
            <div key={a.id} className="px-5 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <StatusBadge status={a.severity} />
                <span className="text-sm truncate">{a.message}</span>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{a.created_at}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
