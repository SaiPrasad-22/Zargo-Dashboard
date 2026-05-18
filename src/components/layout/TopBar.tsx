import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, Settings, ChevronDown, Search, MapPin, Calendar } from "lucide-react";
import { useStore } from "@/data/store";
import { useAuth } from "@/context/AuthContext";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useState } from "react";

const TopBar = () => {
  const navigate = useNavigate();
  const alerts = useStore((s) => s.alerts);
  const markAlertRead = useStore((s) => s.markAlertRead);
  const unreadCount = alerts.filter((a) => a.status === "unread").length;
  const latestAlerts = alerts.filter((a) => a.status === "unread").slice(0, 5);
  const { role, logout } = useAuth();
  const displayName = role === "admin" ? "Admin" : "Staff";
  const [hub, setHub] = useState("Kukatpally");
  const today = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" });

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
                  {unreadCount}
                </span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-3 border-b font-semibold text-sm">Notifications</div>
            {latestAlerts.length === 0 ? (
              <div className="p-4 text-sm text-muted-foreground text-center">All caught up!</div>
            ) : (
              <div className="max-h-64 overflow-y-auto">
                {latestAlerts.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => markAlertRead(a.id)}
                    className="w-full text-left px-3 py-2.5 hover:bg-muted transition-colors border-b last:border-0"
                  >
                    <p className="text-sm font-medium">{a.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.created_at}</p>
                  </button>
                ))}
              </div>
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
