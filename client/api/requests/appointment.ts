import { Appointment } from "@/interfaces/appointment.interface";
import { API_BASE_URL } from "..";
import { Status } from "@/interfaces/status.interface";

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

export const updateTimeSlotStatus = async (params: {
  id: number;
  value: number;
}): Promise<{
  success: boolean;
  data: Status;
  message: string;
  errors?: any;
}> => {
  const response = await fetch(
    `${API_BASE_URL}/appointments/${params.id}/status`,
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status_id: params.value }),
    },
  );

  return await response.json();
};
