import { Vehicle, Booking, Alert, Employee } from "./types";

<<<<<<< HEAD
export const vehicles: Vehicle[] = [
  { id: "V001", vehicle_number: "TG01AB1234", model: "Quanta S+", status: "rented", hub: "Kukatpally", created_at: "2025-12-01" },
  { id: "V002", vehicle_number: "TG01CD5678", model: "Quanta S", status: "available", hub: "Kukatpally", created_at: "2025-12-05" },
  { id: "V003", vehicle_number: "TG02EF9012", model: "Quanta S+", status: "rented", hub: "Madhapur", created_at: "2026-01-10" },
  { id: "V004", vehicle_number: "TG03GH3456", model: "Quanta S", status: "service", hub: "Gachibowli", created_at: "2026-01-20" },
  { id: "V005", vehicle_number: "TG04IJ7890", model: "Quanta S+", status: "rented", hub: "Kukatpally", created_at: "2026-02-01" },
  { id: "V006", vehicle_number: "TG05KL2345", model: "Quanta S", status: "available", hub: "Madhapur", created_at: "2026-02-15" },
  { id: "V007", vehicle_number: "TG06MN6789", model: "Quanta S+", status: "idle", hub: "Gachibowli", created_at: "2026-03-01" },
  { id: "V008", vehicle_number: "TG07OP1122", model: "Quanta S", status: "rented", hub: "Kukatpally", created_at: "2026-03-10" },
];

export const bookings: Booking[] = [
  { id: "ZRG-101", rider_name: "Parthiban T", phone: "7396272220", vehicle_id: "V001", start_date: "2026-03-25", end_date: "2026-04-25", allowed_km: 1500, current_km: 1200, status: "active", created_at: "2026-03-25" },
  { id: "ZRG-102", rider_name: "Rahul Sharma", phone: "9876543210", vehicle_id: "V003", start_date: "2026-04-01", end_date: "2026-04-17", allowed_km: 1500, current_km: 1620, status: "active", created_at: "2026-04-01" },
  { id: "ZRG-103", rider_name: "Teja P", phone: "9021651145", vehicle_id: "V005", start_date: "2026-03-10", end_date: "2026-04-10", allowed_km: 1500, current_km: 1450, status: "overdue", created_at: "2026-03-10" },
  { id: "ZRG-104", rider_name: "Ankit Mehra", phone: "8899776655", vehicle_id: "V008", start_date: "2026-02-01", end_date: "2026-03-01", allowed_km: 1500, current_km: 1500, status: "overdue", created_at: "2026-02-01" },
  { id: "ZRG-105", rider_name: "Priya Reddy", phone: "9988776655", vehicle_id: "V002", start_date: "2026-04-08", end_date: "2026-05-08", allowed_km: 1500, current_km: 200, status: "pending", created_at: "2026-04-08" },
  { id: "ZRG-106", rider_name: "Kiran Kumar", phone: "7766554433", vehicle_id: "V006", start_date: "2026-01-15", end_date: "2026-02-15", allowed_km: 1500, current_km: 1500, status: "completed", created_at: "2026-01-15" },
];

function generateAlerts(): Alert[] {
  const today = new Date("2026-04-11");
  const alerts: Alert[] = [];
  let alertId = 1;

  for (const booking of bookings) {
    if (booking.status === "completed") continue;

    const endDate = new Date(booking.end_date);
    const diffDays = Math.ceil((endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 6) {
      alerts.push({ id: `A${alertId++}`, message: `6 days left for ${booking.rider_name}`, type: "rider", severity: "info", status: "unread", created_at: today.toISOString().split("T")[0] });
    }
    if (diffDays === 1) {
      alerts.push({ id: `A${alertId++}`, message: `1 day left for ${booking.rider_name}`, type: "rider", severity: "warning", status: "unread", created_at: today.toISOString().split("T")[0] });
    }
    if (diffDays < 0 && diffDays >= -14) {
      alerts.push({ id: `A${alertId++}`, message: `Vehicle not returned – ${booking.rider_name}`, type: "management", severity: "critical", status: "unread", created_at: today.toISOString().split("T")[0] });
    }
    if (diffDays < -14) {
      alerts.push({ id: `A${alertId++}`, message: `THEFT ALERT – ${booking.vehicle_id}`, type: "management", severity: "critical", status: "unread", created_at: today.toISOString().split("T")[0] });
    }
    if (booking.current_km > booking.allowed_km) {
      alerts.push({ id: `A${alertId++}`, message: `KM exceeded for ${booking.rider_name} (${booking.current_km}/${booking.allowed_km} km)`, type: "rider", severity: "warning", status: "unread", created_at: today.toISOString().split("T")[0] });
    }
  }

  alerts.push({ id: `A${alertId++}`, message: "Monthly vehicle service due for V004", type: "employee", severity: "info", status: "read", created_at: "2026-04-09" });
  alerts.push({ id: `A${alertId++}`, message: "New hub registration pending approval", type: "management", severity: "info", status: "read", created_at: "2026-04-07" });

  return alerts;
}

export const alerts: Alert[] = generateAlerts();

export const employees: Employee[] = [
  { id: "E001", name: "Rahul Sharma", email: "rahul.sharma@zargo.in", phone: "+91 98765 43210", role: "Admin", onboard_count: 45, join_date: "2022-06-15", status: "Active" },
  { id: "E002", name: "Priya Reddy", email: "priya.reddy@zargo.in", phone: "+91 87654 32109", role: "Manager", onboard_count: 38, join_date: "2022-09-01", status: "Active" },
  { id: "E003", name: "Arjun Kumar", email: "arjun.kumar@zargo.in", phone: "+91 76543 21098", role: "Staff", onboard_count: 22, join_date: "2023-01-10", status: "Active" },
  { id: "E004", name: "Sneha Patel", email: "sneha.patel@zargo.in", phone: "+91 65432 10987", role: "Staff", onboard_count: 31, join_date: "2023-03-20", status: "Active" },
  { id: "E005", name: "Vikram Singh", email: "vikram.singh@zargo.in", phone: "+91 99887 76655", role: "Staff", onboard_count: 18, join_date: "2023-08-05", status: "Inactive" },
];
=======
// All data now fetched from MongoDB via API — no dummy data.
export const vehicles: Vehicle[] = [];

export const bookings: Booking[] = [];

export const alerts: Alert[] = [];

export const employees: Employee[] = [];
>>>>>>> 6cd35a0 (Initial commit)
