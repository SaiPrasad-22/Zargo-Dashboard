import { apiClient, mockOr } from "@/api/client";
import { ReportSummary, VehicleStatus, BookingStatus } from "@/types";
import { useStore } from "@/data/store";

export const reportService = {
  async getSummary(): Promise<ReportSummary> {
    return mockOr(
      () => {
        const { vehicles, bookings, employees } = useStore.getState();
        const vStatuses: VehicleStatus[] = ["available", "rented", "service", "idle"];
        const bStatuses: BookingStatus[] = ["active", "pending", "overdue", "completed"];
        return {
          fleetSize: vehicles.length,
          totalBookings: bookings.length,
          completedBookings: bookings.filter((b) => b.status === "completed").length,
          totalOnboarded: employees.reduce((s, e) => s + e.onboard_count, 0),
          vehicleStatusBreakdown: vStatuses.map((s) => ({ name: s, value: vehicles.filter((v) => v.status === s).length })),
          bookingStatusBreakdown: bStatuses.map((s) => ({ status: s, count: bookings.filter((b) => b.status === s).length })),
          rentalTrend: [
            { month: "Nov", rentals: 18, revenue: 92000 },
            { month: "Dec", rentals: 22, revenue: 108000 },
            { month: "Jan", rentals: 28, revenue: 121000 },
            { month: "Feb", rentals: 32, revenue: 135000 },
            { month: "Mar", rentals: 36, revenue: 142000 },
            { month: "Apr", rentals: 41, revenue: 158000 },
          ],
        };
      },
      async () => (await apiClient.get<ReportSummary>("/reports/summary")).data
    );
  },
};