import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { bookingService } from "@/services";
import { Booking } from "@/types";
import { notify } from "@/lib/notify";

const KEY = ["bookings"];

export const useBookings = () => useQuery({ queryKey: KEY, queryFn: bookingService.list });

export const useAddBooking = () => {
  const qc = useQueryClient();
  return useMutation({
<<<<<<< HEAD
    mutationFn: (payload: Omit<Booking, "id" | "created_at">) => bookingService.create(payload),
=======
    mutationFn: (payload: Omit<Booking, "_id" | "createdAt" | "updatedAt">) => bookingService.create(payload),
>>>>>>> 6cd35a0 (Initial commit)
    onSuccess: (b) => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      qc.invalidateQueries({ queryKey: ["alerts"] });
      qc.invalidateQueries({ queryKey: ["dashboard-stats"] });
<<<<<<< HEAD
      notify.success("Booking created", `Booking for ${b.rider_name} created.`);
=======
      notify.success("Booking created", `Booking for ${b.riderName} created.`);
>>>>>>> 6cd35a0 (Initial commit)
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