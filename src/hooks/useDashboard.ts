import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services";

export const useDashboardStats = () =>
  useQuery({ queryKey: ["dashboard-stats"], queryFn: dashboardService.getStats });