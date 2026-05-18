import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { alertService } from "@/services";
import { Alert } from "@/types";
import { notify } from "@/lib/notify";

const KEY = ["alerts"];

export const useAlerts = () => useQuery({ queryKey: KEY, queryFn: alertService.list });

export const useAddAlert = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Alert, "id" | "created_at">) => alertService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      notify.success("Alert created");
    },
    onError: (e: unknown) => notify.apiError(e),
  });
};

export const useMarkAlertRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertService.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
  });
};