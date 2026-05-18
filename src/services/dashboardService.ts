import { apiClient, mockOr } from "@/api/client";
import { DashboardStats } from "@/types";
import { useStore } from "@/data/store";

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    return mockOr(
      () => {
        const { vehicles, bookings, alerts } = useStore.getState();
        return {
          totalVehicles: vehicles.length,
          availableVehicles: vehicles.filter((v) => v.status === "available").length,
          deployedVehicles: vehicles.filter((v) => v.status === "rented").length,
          activeRentals: bookings.filter((b) => b.status === "active").length,
          overdueVehicles: bookings.filter((b) => b.status === "overdue").length,
          totalCustomers: new Set(bookings.map((b) => b.phone)).size,
          unreadAlerts: alerts.filter((a) => a.status === "unread").length,
          revenue: "₹1,28,600",
        };
      },
      async () => (await apiClient.get<DashboardStats>("/dashboard/stats")).data
    );
  },
};