import { create } from "zustand";
import { Vehicle, Booking, Alert, Employee } from "./types";
<<<<<<< HEAD
import { vehicles as dummyVehicles, bookings as dummyBookings, alerts as dummyAlerts, employees as dummyEmployees } from "./dummyData";
=======
>>>>>>> 6cd35a0 (Initial commit)

function generateAlerts(bookings: Booking[], existingManualAlerts: Alert[]): Alert[] {
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const auto: Alert[] = [];
  let id = 1;

  for (const b of bookings) {
    if (b.status === "completed") continue;
    const end = new Date(b.end_date);
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff < 0) {
      auto.push({ id: `AUTO-${id++}`, message: `Vehicle not returned – ${b.rider_name}`, type: "management", severity: "critical", status: "unread", created_at: todayStr });
    }
    if (diff >= 3 && diff <= 7) {
      auto.push({ id: `AUTO-${id++}`, message: `${diff} days left for ${b.rider_name}`, type: "rider", severity: "info", status: "unread", created_at: todayStr });
    }
    if (diff >= 0 && diff <= 2) {
      auto.push({ id: `AUTO-${id++}`, message: `${diff} day${diff !== 1 ? "s" : ""} left for ${b.rider_name}`, type: "rider", severity: "warning", status: "unread", created_at: todayStr });
    }
    if (b.current_km > b.allowed_km) {
      auto.push({ id: `AUTO-${id++}`, message: `KM exceeded for ${b.rider_name} (${b.current_km}/${b.allowed_km} km)`, type: "rider", severity: "warning", status: "unread", created_at: todayStr });
    }
  }

  // Keep manually added or read alerts, prepend auto-generated
  const manual = existingManualAlerts.filter((a) => !a.id.startsWith("AUTO-"));
  return [...auto, ...manual];
}

function applyBookingStatuses(bookings: Booking[]): Booking[] {
  const today = new Date();
  return bookings.map((b) => {
    if (b.status === "completed") return b;
    const end = new Date(b.end_date);
    if (today > end) return { ...b, status: "overdue" as const };
    return b;
  });
}

interface AppState {
  vehicles: Vehicle[];
  bookings: Booking[];
  alerts: Alert[];
  employees: Employee[];
  addVehicle: (v: Omit<Vehicle, "id" | "created_at">) => void;
  updateVehicle: (id: string, v: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  addBooking: (b: Omit<Booking, "id" | "created_at">) => void;
  updateBookingStatus: (id: string, status: Booking["status"]) => void;
  addAlert: (a: Omit<Alert, "id" | "created_at">) => void;
  markAlertRead: (id: string) => void;
  addEmployee: (e: Omit<Employee, "id">) => void;
  updateEmployeeCount: (id: string, count: number) => void;
}

export const useStore = create<AppState>((set) => ({
<<<<<<< HEAD
  vehicles: dummyVehicles,
  bookings: applyBookingStatuses(dummyBookings),
  alerts: generateAlerts(applyBookingStatuses(dummyBookings), dummyAlerts),
  employees: dummyEmployees,
=======
  vehicles: [],
  bookings: [],
  alerts: [],
  employees: [],
>>>>>>> 6cd35a0 (Initial commit)

  addVehicle: (v) => set((s) => ({
    vehicles: [...s.vehicles, { ...v, id: `V${String(s.vehicles.length + 1).padStart(3, "0")}`, created_at: new Date().toISOString().split("T")[0] }],
  })),
  updateVehicle: (id, v) => set((s) => ({
    vehicles: s.vehicles.map((x) => (x.id === id ? { ...x, ...v } : x)),
  })),
  deleteVehicle: (id) => set((s) => ({
    vehicles: s.vehicles.filter((x) => x.id !== id),
  })),
  addBooking: (b) => set((s) => {
    const newBookings = [...s.bookings, { ...b, id: `ZRG-${s.bookings.length + 100}`, created_at: new Date().toISOString().split("T")[0] }];
    const updated = applyBookingStatuses(newBookings);
    return { bookings: updated, alerts: generateAlerts(updated, s.alerts) };
  }),
  updateBookingStatus: (id, status) => set((s) => {
    const newBookings = s.bookings.map((x) => (x.id === id ? { ...x, status } : x));
    const updated = applyBookingStatuses(newBookings);
    return { bookings: updated, alerts: generateAlerts(updated, s.alerts) };
  }),
  addAlert: (a) => set((s) => ({
    alerts: [{ ...a, id: `A${s.alerts.length + 1}`, created_at: new Date().toISOString().split("T")[0] }, ...s.alerts],
  })),
  markAlertRead: (id) => set((s) => ({
    alerts: s.alerts.map((x) => (x.id === id ? { ...x, status: "read" as const } : x)),
  })),
  addEmployee: (e) => set((s) => ({
    employees: [...s.employees, { ...e, id: `E${String(s.employees.length + 1).padStart(3, "0")}` }],
  })),
  updateEmployeeCount: (id, count) => set((s) => ({
    employees: s.employees.map((x) => (x.id === id ? { ...x, onboard_count: count } : x)),
  })),
}));
