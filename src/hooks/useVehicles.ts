import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { vehicleService } from "@/services";
import { Vehicle } from "@/types";
import { notify } from "@/lib/notify";

const KEY = ["vehicles"];

export const useVehicles = () => useQuery({ queryKey: KEY, queryFn: vehicleService.list });

export const useAddVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
<<<<<<< HEAD
    mutationFn: (payload: Omit<Vehicle, "id" | "created_at">) => vehicleService.create(payload),
    onSuccess: (v) => {
      qc.invalidateQueries({ queryKey: KEY });
      notify.success("Vehicle added", `${v.vehicle_number} added successfully.`);
=======
    mutationFn: (payload: Omit<Vehicle, "_id" | "createdAt" | "updatedAt">) => vehicleService.create(payload),
    onSuccess: (v) => {
      qc.invalidateQueries({ queryKey: KEY });
      notify.success("Vehicle added", `${v.numberPlate} added successfully.`);
>>>>>>> 6cd35a0 (Initial commit)
    },
    onError: (e: { message: string }) => notify.error("Failed to add vehicle", e.message),
  });
};

export const useUpdateVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Vehicle> }) => vehicleService.update(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEY }),
    onError: (e: { message: string }) => notify.error("Failed to update vehicle", e.message),
  });
};

export const useDeleteVehicle = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => vehicleService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      notify.success("Vehicle removed");
    },
    onError: (e: { message: string }) => notify.error("Failed to delete vehicle", e.message),
  });
};