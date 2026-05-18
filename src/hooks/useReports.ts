import { useQuery } from "@tanstack/react-query";
import { reportService } from "@/services";

export const useReportSummary = () =>
  useQuery({ queryKey: ["report-summary"], queryFn: reportService.getSummary });