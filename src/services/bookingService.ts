import { apiClient, mockOr } from "@/api/client";
import { Booking } from "@/types";
import { useStore } from "@/data/store";

export const bookingService = {
  async list(): Promise<Booking[]> {
    return mockOr(
      () => useStore.getState().bookings,
      async () => (await apiClient.get<Booking[]>("/bookings")).data
    );
  },
<<<<<<< HEAD
  async create(payload: Omit<Booking, "id" | "created_at">): Promise<Booking> {
    return mockOr(
      () => {
        useStore.getState().addBooking(payload);
        useStore.getState().updateVehicle(payload.vehicle_id, { status: "rented" });
=======
  async create(payload: Omit<Booking, "_id" | "createdAt" | "updatedAt">): Promise<Booking> {
    return mockOr(
      () => {
        useStore.getState().addBooking(payload);
        useStore.getState().updateVehicle(payload.vehicle, { status: "rented" });
>>>>>>> 6cd35a0 (Initial commit)
        const list = useStore.getState().bookings;
        return list[list.length - 1];
      },
      async () => (await apiClient.post<Booking>("/bookings", payload)).data
    );
  },
  async updateStatus(id: string, status: Booking["status"]): Promise<Booking> {
    return mockOr(
      () => {
        useStore.getState().updateBookingStatus(id, status);
<<<<<<< HEAD
        return useStore.getState().bookings.find((b) => b.id === id)!;
=======
        return useStore.getState().bookings.find((b) => b._id === id)!;
>>>>>>> 6cd35a0 (Initial commit)
      },
      async () => (await apiClient.patch<Booking>(`/bookings/${id}`, { status })).data
    );
  },
};