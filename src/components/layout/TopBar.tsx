import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Settings, ChevronDown, Search, MapPin, Calendar, AlertCircle, AlertTriangle, Info, ArrowRight } from "lucide-react";
import { useStore } from "@/data/store";
import { useAuth } from "@/context/AuthContext";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

const TopBar = () => {
  const navigate = useNavigate();
  const alerts = useStore((s) => s.alerts);
  const markAlertRead = useStore((s) => s.markAlertRead);
  const { role, logout } = useAuth();
  const displayName = role === "admin" ? "Admin" : "Staff";
  const [hub, setHub] = useState("Kukatpally");
  const [activeTab, setActiveTab] = useState<"unread" | "critical" | "warning" | "info">("unread");
  const today = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

  // Categorize alerts
  const unreadAlerts = alerts.filter((a) => a.status === "unread");
  const criticalAlerts = alerts.filter((a) => a.severity === "critical");
  const warningAlerts = alerts.filter((a) => a.severity === "warning");
  const infoAlerts = alerts.filter((a) => a.severity === "info");
  const unreadCount = unreadAlerts.length;

  // Get alerts for current tab
  const getTabAlerts = () => {
    switch (activeTab) {
      case "critical":
        return criticalAlerts.slice(0, 5);
      case "warning":
        return warningAlerts.slice(0, 5);
      case "info":
        return infoAlerts.slice(0, 5);
      case "unread":
      default:
        return unreadAlerts.slice(0, 5);
    }
  };

  const tabAlerts = getTabAlerts();

  const severityMeta = {
    critical: { icon: AlertCircle, text: "text-destructive", bg: "bg-destructive/10" },
    warning: { icon: AlertTriangle, text: "text-warning", bg: "bg-warning/10" },
    info: { icon: Info, text: "text-primary", bg: "bg-primary/10" },
  };

  const handleAlertClick = (alertId: string) => {
    markAlertRead(alertId);
    navigate("/alerts");
  };

  return (
    <header className="h-16 bg-card/80 backdrop-blur border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <div className="relative w-full hidden md:block">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search vehicles, bookings, riders..." className="pl-9 h-9 bg-muted/40 border-transparent focus-visible:bg-card focus-visible:border-border" />
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden lg:flex items-center gap-1.5 text-xs text-muted-foreground border-r pr-3">
          <Calendar size={14} /> {today}
        </div>
        <Select value={hub} onValueChange={setHub}>
          <SelectTrigger className="h-9 w-[170px] gap-1.5 hidden sm:flex">
            <MapPin size={14} className="text-primary" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Kukatpally">Kukatpally Hub</SelectItem>
            <SelectItem value="Madhapur">Madhapur Hub</SelectItem>
            <SelectItem value="Gachibowli">Gachibowli Hub</SelectItem>
            <SelectItem value="all">All Hubs</SelectItem>
          </SelectContent>
        </Select>
        <Popover>
          <PopoverTrigger asChild>
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell size={18} className="text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-accent text-accent-foreground text-[9px] font-bold rounded-full flex items-center justify-center min-w-[18px] min-h-[18px]">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end">
            <div className="p-4 border-b">
              <h3 className="font-semibold text-sm">Notifications</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {unreadCount === 0 ? "All caught up!" : `${unreadCount} unread alert${unreadCount !== 1 ? "s" : ""}`}
              </p>
            </div>

            {alerts.length === 0 ? (
              <div className="p-8 text-center">
                <Bell size={24} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm text-muted-foreground">No alerts yet</p>
              </div>
            ) : (
              <>
                {/* Tab Navigation */}
                <div className="flex border-b px-2 pt-2 gap-0.5 overflow-x-auto">
                  {[
                    { id: "unread" as const, label: "Unread", count: unreadAlerts.length, icon: null },
                    { id: "critical" as const, label: "Critical", count: criticalAlerts.length, icon: AlertCircle },
                    { id: "warning" as const, label: "Warnings", count: warningAlerts.length, icon: AlertTriangle },
                    { id: "info" as const, label: "Info", count: infoAlerts.length, icon: Info },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium whitespace-nowrap transition-colors border-b-2",
                        activeTab === tab.id
                          ? "border-primary text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {tab.icon && <tab.icon size={13} />}
                      {tab.label}
                      {tab.count > 0 && (
                        <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs rounded-full bg-muted text-muted-foreground min-w-[20px]">
                          {tab.count > 99 ? "99+" : tab.count}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Alerts List */}
                <div className="max-h-80 overflow-y-auto">
                  {tabAlerts.length === 0 ? (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                      No {activeTab} alerts
                    </div>
                  ) : (
                    tabAlerts.map((a) => {
                      const meta = a.severity === "critical" || a.severity === "warning" || a.severity === "info"
                        ? severityMeta[a.severity]
                        : severityMeta.info;
                      const Icon = meta.icon;

                      return (
                        <button
                          key={a.id}
                          onClick={() => handleAlertClick(a.id)}
                          className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors border-b last:border-0 flex items-start gap-3 group"
                        >
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5", meta.bg, meta.text)}>
                            <Icon size={16} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-sm font-medium line-clamp-2",
                              a.status === "unread" && "text-foreground font-semibold"
                            )}>
                              {a.message}
                              {a.status === "unread" && (
                                <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-primary align-middle" />
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(a.created_at).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5" />
                        </button>
                      );
                    })
                  )}
                </div>

                {/* View All Button */}
                <button
                  onClick={() => navigate("/alerts")}
                  className="w-full px-4 py-3 text-sm font-medium text-center border-t hover:bg-muted/30 transition-colors flex items-center justify-center gap-2 text-primary"
                >
                  View all alerts
                  <ArrowRight size={14} />
                </button>
              </>
            )}
          </PopoverContent>
        </Popover>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-2 border-l hover:bg-muted rounded-lg px-2 py-1.5 transition-colors">
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                <User size={14} className="text-primary" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">{displayName}</span>
              <ChevronDown size={14} className="text-muted-foreground hidden sm:inline" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {role === "admin" && <DropdownMenuItem className="gap-2" onClick={() => navigate("/settings")}>
              <Settings size={14} /> Settings
            </DropdownMenuItem>}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-destructive"
              onClick={async () => {
                await logout();
                navigate("/login", { replace: true });
              }}
            >
              <LogOut size={14} /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopBar;
