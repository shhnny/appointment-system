import { Resident } from "./resident.interface";
import { Service } from "./service.interface";
import { Status } from "./status.interface";
import { TimeSlot } from "./time_slot.interface";

export interface Appointment {
  resident: Resident;
  appointment_id: number;
  status: Status;
  time_slot: TimeSlot;
  service: Service;
  reference_no: string;
  created_at: string;
}
