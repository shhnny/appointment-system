import { Resident } from "@/interfaces/resident.interface";
import { API_BASE_URL } from "..";

export const createResident = async (
  params: any,
): Promise<{
  data: Resident;
  success: boolean;
}> => {
  const response = await fetch(`${API_BASE_URL}/residents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(params),
  });

  return await response.json();
};
