import { useState } from "react";
import { useAlerts, useMarkAlertRead } from "@/hooks/useAlerts";
import { TableSkeleton } from "@/components/states/LoadingSkeleton";
import { AlertTriangle, AlertCircle, Info, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

const severityTabs = ["all", "critical", "warning", "info"] as const;
const typeTabs = ["all", "rider", "employee", "management"] as const;

const severityMeta: Record<string, { icon: typeof Bell; border: string; text: string; bg: string }> = {
  critical: { icon: AlertCircle, border: "border-l-destructive", text: "text-destructive", bg: "bg-destructive/10" },
  warning: { icon: AlertTriangle, border: "border-l-warning", text: "text-warning", bg: "bg-warning/10" },
  info: { icon: Info, border: "border-l-primary", text: "text-primary", bg: "bg-primary/10" },
};

const AlertsPage = () => {
  const alertsQ = useAlerts();
  const alerts = alertsQ.data ?? [];
  const markAlertRead = useMarkAlertRead();
  const [severity, setSeverity] = useState<typeof severityTabs[number]>("all");
  const [type, setType] = useState<typeof typeTabs[number]>("all");

  const filtered = alerts.filter((a) =>
    (severity === "all" || a.severity === severity) &&
    (type === "all" || a.type === type)
  );

  const counts = {
    all: alerts.length,
    critical: alerts.filter((a) => a.severity === "critical").length,
    warning: alerts.filter((a) => a.severity === "warning").length,
    info: alerts.filter((a) => a.severity === "info").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Alerts</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Real-time notifications across your operation</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {severityTabs.map((t) => (
          <button
            key={t}
            onClick={() => setSeverity(t)}
            className={cn(
              "px-3.5 py-1.5 rounded-full text-xs font-medium capitalize transition-all border",
              severity === t ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted border-border"
            )}
          >
            {t} <span className="ml-1 opacity-70">{counts[t as keyof typeof counts]}</span>
          </button>
        ))}
        <span className="mx-2 h-5 w-px bg-border" />
        {typeTabs.map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors border",
              type === t ? "bg-foreground/90 text-background border-foreground" : "bg-card hover:bg-muted border-border text-muted-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-2.5">
        {alertsQ.isLoading ? (
          <TableSkeleton rows={5} cols={3} />
        ) : filtered.length === 0 ? (
          <div className="bg-card rounded-xl border p-12 text-center text-muted-foreground">
            <Bell size={28} className="mx-auto mb-2 opacity-40" />
            No alerts match your filters
          </div>
        ) : (
          filtered.map((a) => {
            const meta = severityMeta[a.severity] || severityMeta.info;
            const Icon = meta.icon;
            return (
              <div
                key={a.id}
                className={cn(
                  "bg-card rounded-lg border border-l-4 px-5 py-4 flex items-center justify-between gap-4 hover:shadow-sm transition-all",
                  meta.border,
                  a.status === "unread" && "ring-1 ring-border/80"
                )}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", meta.bg, meta.text)}>
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-sm", a.status === "unread" && "font-semibold")}>
                      {a.message}
                      {a.status === "unread" && <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-primary align-middle" />}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 capitalize">
                      <span className={meta.text}>{a.severity}</span> · {a.type} · {a.created_at}
                    </p>
                  </div>
                </div>
                {a.status === "unread" && (
                  <button
                    onClick={() => markAlertRead.mutate(a.id)}
                    className="text-xs text-primary hover:underline shrink-0 font-medium"
                  >
                    Mark read
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
