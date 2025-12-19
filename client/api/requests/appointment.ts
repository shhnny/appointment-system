import { Appointment } from "@/interfaces/appointment.interface";
import { API_BASE_URL } from "..";

export const getAppointments = async (): Promise<{
  data: Appointment[];
  success: boolean;
}> => {
  const response = await fetch(`${API_BASE_URL}/appointments`);

  return await response.json();
};
