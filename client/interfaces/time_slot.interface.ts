export interface TimeSlot {
  timeslot_id: number;
  slot_date: string;
  start_time: string;
  end_time: string;
  max_capacity: number;
  available_slots: number;
}

export interface TimeSlotParam {
  slot_date?: string;
  start_time?: string;
  end_time?: string;
  max_capacity?: number;
  available_slots: number;
}
