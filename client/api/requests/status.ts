import { Status } from "@/interfaces/status.interface";
import { API_BASE_URL } from "..";

export const getStatuses = async (): Promise<{
  data: Status[];
  success: boolean;
}> => {
  const response = await fetch(`${API_BASE_URL}/status`);

  return await response.json();
};
