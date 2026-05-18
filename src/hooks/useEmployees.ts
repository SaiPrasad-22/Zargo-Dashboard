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
<<<<<<< HEAD
    onSuccess: (e) => {
      qc.invalidateQueries({ queryKey: KEY });
      notify.success("Employee added", `${e.name} joined the team.`);
=======
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: KEY });
      const payload = (result as any).employee ?? result;
      const credentials = (result as any).credentials;
      notify.success(
        "Employee added",
        credentials
          ? `Login: ${credentials.email} | Password: ${credentials.password}`
          : `${payload.name} joined the team.`
      );
>>>>>>> 6cd35a0 (Initial commit)
    },
    onError: (e: unknown) => notify.apiError(e),
  });
};