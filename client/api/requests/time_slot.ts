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
): Promise<{
  data: TimeSlot;
  success: boolean;
  message: string;
  errors?: any;
}> => {
  const response = await fetch(`${API_BASE_URL}/time-slots`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify(params),
  });

  return await response.json();
};

export const getPublicTimeSlots = async (): Promise<{
  data: TimeSlot[];
  success: boolean;
}> => {
  const response = await fetch(`${API_BASE_URL}/public/time-slots/available`);
  return await response.json();
};
