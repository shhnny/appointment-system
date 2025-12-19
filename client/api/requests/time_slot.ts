import { TimeSlot, TimeSlotParam } from "@/interfaces/time_slot.interface";
import { API_BASE_URL } from "..";

export const getTimeSlots = async (): Promise<{
  data: TimeSlot[];
  success: boolean;
}> => {
  const response = await fetch(`${API_BASE_URL}/time-slots`);
  return await response.json();
};

export const createTimeSlot = async (
  params: TimeSlotParam,
): Promise<{ data: TimeSlot; success: boolean; message: string }> => {
  const response = await fetch(`${API_BASE_URL}/time-slots`, {
    method: "POST",
    headers: { Accept: "application/json" },

    body: JSON.stringify(params),
  });

  return await response.json();
};
