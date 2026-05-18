import { useState } from "react";
import { useBookings, useAddBooking } from "@/hooks/useBookings";
import { useVehicles } from "@/hooks/useVehicles";
import StatusBadge from "@/components/StatusBadge";
import { Plus, Search, CalendarDays, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TableSkeleton } from "@/components/states/LoadingSkeleton";
import { EmptyState } from "@/components/states/EmptyState";

type BookingStatus = "active" | "completed" | "overdue" | "pending";

interface BookingForm {
  riderName: string;
  phone: string;
  vehicle: string;
  startDate: string;
  endDate: string;
  kmLimit: number;
  kmUsed: number;
  status: BookingStatus;
}

const BookingsPage = () => {
  const bookingsQ = useBookings();
  const bookings = (bookingsQ.data ?? []) as any[];
  const { data: vehicles = [] } = useVehicles();
  const addBooking = useAddBooking();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [form, setForm] = useState<BookingForm>({ riderName: "", phone: "", vehicle: "", startDate: "", endDate: "", kmLimit: 1500, kmUsed: 0, status: "active" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const normalizedVehicleText = (vehicle: any) => {
    if (typeof vehicle === "string") return vehicle;
    return `${vehicle.vehicleId ?? vehicle.vehicle_number ?? vehicle.model ?? ""} ${vehicle.numberPlate ?? vehicle.vehicle_number ?? ""} ${vehicle.model ?? ""}`.trim();
  };

  const getVehicleId = (vehicle: any) => vehicle._id ?? vehicle.id ?? "";
  const getVehicleLabel = (vehicle: any) => `${vehicle.model ?? ""} – ${vehicle.numberPlate ?? vehicle.vehicle_number ?? vehicle.vehicleId ?? ""}`.trim();
  const availableVehicles = (vehicles as any[]).filter((v) => v.status === "available");

  const filtered = bookings.filter((b) => {
    const vehicleText = normalizedVehicleText(b.vehicle);
    const matchSearch = b.riderName.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingId.toLowerCase().includes(search.toLowerCase()) ||
      vehicleText.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const initials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const summary = {
    total: bookings.length,
    active: bookings.filter((b) => b.status === "active").length,
    overdue: bookings.filter((b) => b.status === "overdue").length,
    pending: bookings.filter((b) => b.status === "pending").length,
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    if (!form.riderName.trim()) newErrors.riderName = "Rider name is required";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    if (!form.vehicle) newErrors.vehicle = "Vehicle is required";
    if (!form.startDate) newErrors.startDate = "Start date is required";
    if (!form.endDate) newErrors.endDate = "End date is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    addBooking.mutate(form as any, {
      onSuccess: () => {
        setForm({ riderName: "", phone: "", vehicle: "", startDate: "", endDate: "", kmLimit: 1500, kmUsed: 0, status: "active" });
        setErrors({});
        setOpen(false);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage rider bookings and assignments</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus size={16} className="mr-2" />Add Booking</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add Booking</DialogTitle></DialogHeader>
            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label>Rider Name</Label>
                <Input placeholder="e.g. Rahul Sharma" value={form.riderName} onChange={(e) => setForm({ ...form, riderName: e.target.value })} />
                {errors.riderName && <p className="text-xs text-destructive">{errors.riderName}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number</Label>
                <Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Vehicle</Label>
              <Select value={form.vehicle} onValueChange={(v) => setForm({ ...form, vehicle: v })}>
                <SelectTrigger><SelectValue placeholder="Select available vehicle" /></SelectTrigger>
                <SelectContent>
                  {availableVehicles.length > 0 ? (
                    availableVehicles.map((v) => {
                      const id = getVehicleId(v);
                      return <SelectItem key={id} value={id}>{getVehicleLabel(v)}</SelectItem>;
                    })
                  ) : (
                    <SelectItem value="" disabled>
                      No available vehicles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
                {errors.vehicle && <p className="text-xs text-destructive">{errors.vehicle}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Start Date</Label>
                  <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
                  {errors.startDate && <p className="text-xs text-destructive">{errors.startDate}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>End Date</Label>
                  <Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} />
                  {errors.endDate && <p className="text-xs text-destructive">{errors.endDate}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>KM Limit</Label>
                <Input type="number" placeholder="Allowed KM" value={form.kmLimit} onChange={(e) => setForm({ ...form, kmLimit: Number(e.target.value) })} />
              </div>
              <Button className="w-full" onClick={handleSubmit}>Save</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Bookings" value={summary.total} icon={CalendarDays} />
        <StatCard title="Active" value={summary.active} icon={CheckCircle2} accent="success" />
        <StatCard title="Overdue" value={summary.overdue} icon={AlertTriangle} accent="destructive" />
        <StatCard title="Pending" value={summary.pending} icon={Clock} accent="warning" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search bookings..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border overflow-x-auto">
        {bookingsQ.isLoading ? (
          <TableSkeleton rows={6} cols={7} />
        ) : bookingsQ.error ? (
          <EmptyState title="Failed to load bookings" description="Check your backend connection or refresh the page." />
        ) : filtered.length === 0 ? (
          <EmptyState title="No bookings" description="Try adjusting your filters or create a booking." />
        ) : (
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-muted/60 z-10">
            <tr className="border-b">
              {["ID", "Rider", "Vehicle", "Start", "End", "KM", "Status"].map((h) => (
                <th key={h} className="text-left px-5 py-3 font-medium text-muted-foreground text-xs uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const vehicle = (vehicles as any[]).find((v) => getVehicleId(v) === b.vehicle);
              return (
                <tr key={b._id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium whitespace-nowrap text-primary">{b.bookingId}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center shrink-0">
                        {initials(b.riderName)}
                      </div>
                      <div>
                        <div className="font-medium">{b.riderName}</div>
                        <div className="text-xs text-muted-foreground">{b.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap">{vehicle ? `${vehicle.model} – ${vehicle.numberPlate}` : typeof b.vehicle === "string" ? b.vehicle : `${b.vehicle.vehicleId} – ${b.vehicle.numberPlate}`}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{new Date(b.startDate).toLocaleDateString()}</td>
                  <td className="px-5 py-3 whitespace-nowrap text-muted-foreground">{new Date(b.endDate).toLocaleDateString()}</td>
                  <td className="px-5 py-3 whitespace-nowrap">
                    <span className={b.kmUsed > b.kmLimit ? "text-destructive font-semibold" : ""}>{b.kmUsed}</span>
                    <span className="text-muted-foreground">/{b.kmLimit}</span>
                  </td>
                  <td className="px-5 py-3 whitespace-nowrap"><StatusBadge status={b.status} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
