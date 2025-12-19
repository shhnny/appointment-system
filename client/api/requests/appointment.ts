import { Appointment } from "@/interfaces/appointment.interface";
import { API_BASE_URL } from "..";

export const getAppointments = async (): Promise<{
  data: Appointment[];
  success: boolean;
}> => {
  const response = await fetch(`${API_BASE_URL}/appointments`);

  return await response.json();
};

export const createAppointment = async (
  params: any,
): Promise<{
  data: Appointment;
  success: boolean;
}> => {
  const response = await fetch(`${API_BASE_URL}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(params),
  });

  return await response.json();
};
