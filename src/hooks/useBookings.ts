import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services";
import { Booking } from "@/types";
import { notify } from "@/lib/notify";
import { useStore } from "@/data/store";

const KEY = ["bookings"];

export const useBookings = () => useQuery({ queryKey: KEY, queryFn: bookingService.list });

export const useAddBooking = () => {
  const qc = useQueryClient();
  return useMutation({

    mutationFn: (payload: Omit<Booking, "_id" | "createdAt" | "updatedAt">) => bookingService.create(payload),
    onSuccess: (b) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      qc.invalidateQueries({ queryKey: ["alerts"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });

      notify.success("Booking created", `Booking for ${b.riderName} created.`);
      try {
        const addActivity = useStore.getState().addActivity;
        const bookingId = b.bookingId ?? b._id ?? b.id ?? "";
        const msg = `New booking ${b.riderName ?? b.rider_name ?? ""} (${bookingId}) created`;
        addActivity({ type: "booking", message: msg, meta: { bookingId } });
        if (b.vehicle) {
          const vehicleId = typeof b.vehicle === "string" ? b.vehicle : (b.vehicle.numberPlate || b.vehicle.vehicleId || "");
          addActivity({ type: "vehicle", message: `Vehicle ${vehicleId} assigned to ${bookingId}`, meta: { bookingId, vehicleId } });
        }
      } catch (e) {
        // ignore
      }
    },
    onError: (e: unknown) => notify.apiError(e),
  });
};

export const useUpdateBookingStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Booking["status"] }) =>
      bookingService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
};