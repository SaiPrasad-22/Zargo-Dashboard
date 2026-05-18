import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { employeeService } from "@/services";
import { Employee } from "@/types";
import { notify } from "@/lib/notify";

const KEY = ["employees"];

export const useEmployees = () => useQuery({ queryKey: KEY, queryFn: employeeService.list });

export const useAddEmployee = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Omit<Employee, "id">) => employeeService.create(payload),

    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: KEY });
      const payload = (result as any).employee ?? result;
      const credentials = (result as any).credentials;
      notify.success(
        "Employee added",
        credentials
          ? `Login: ${credentials.email} | Password: ${credentials.password}`
          : `${payload.name} joined the team.`
      );    },
    onError: (e: unknown) => notify.apiError(e),
  });
};