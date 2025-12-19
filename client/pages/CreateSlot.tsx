import { createTimeSlot } from "@/api/requests/time_slot";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import { TimeSlotParam } from "@/interfaces/time_slot.interface";
import { useState } from "react";

export default function CreateSlot() {
  const [error, setError] = useState("");
  const [slot, setSlot] = useState<TimeSlotParam>({
    slot_date: undefined,
    start_time: undefined,
    end_time: undefined,
    max_capacity: 100,
    available_slots: undefined,
  });

  async function createSlot() {
    try {
      const data = await createTimeSlot(slot);
      console.log("data: ", data);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-auto transition-all duration-75">
          <div className="p-6">
            <div className="bg-white rounded-lg shadow-sm border border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Add Time Slot
                  </h2>
                </div>
              </div>

              <div className="w-full max-w-sm p-5">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    createSlot();
                  }}
                  className="space-y-4"
                >
                  <div>
                    <div>Date</div>
                    <input
                      value={slot.slot_date}
                      onChange={(e) =>
                        setSlot((prev) => ({
                          ...prev,
                          slot_date: e.target.value,
                        }))
                      }
                      type="date"
                      className="w-full px-4 py-3 bg-white border border-border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <div>Start Time</div>
                    <input
                      value={slot.start_time}
                      type="time"
                      id="minutes"
                      name="minutes"
                      className="w-full px-4 py-3 bg-white border border-border rounded-lg"
                      required
                      onChange={(e) =>
                        setSlot((prev) => ({
                          ...prev,
                          start_time: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <div>End Time</div>
                    <input
                      type="time"
                      id="minutes"
                      name="minutes"
                      value={slot.end_time}
                      className="w-full px-4 py-3 bg-white border border-border rounded-lg"
                      required
                      onChange={(e) =>
                        setSlot((prev) => ({
                          ...prev,
                          end_time: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <div>Max Capacity</div>
                    <input
                      type="number"
                      className="w-full px-4 py-3 bg-white border border-border rounded-lg"
                      value={slot.max_capacity}
                      onChange={(e) =>
                        setSlot((prev) => ({
                          ...prev,
                          max_capacity: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <div>Available Slots</div>
                    <input
                      type="number"
                      className="w-full px-4 py-3 bg-white border border-border rounded-lg"
                      value={slot.available_slots}
                      onChange={(e) =>
                        setSlot((prev) => ({
                          ...prev,
                          available_slots: Number(e.target.value),
                        }))
                      }
                      required
                    />
                  </div>
                  {error && (
                    <div className="text-red-500 border rounded-lg px-3 py-2 border-red-600 bg-red-600/10">
                      {error}
                    </div>
                  )}
                  <button className="w-full px-6 py-4 bg-primary text-primary-foreground font-semibold rounded-lg mt-6">
                    Create Slot
                  </button>
                </form>
              </div>

              <div className="mt-8 text-center text-xs text-muted-foreground py-4 border-t border-border">
                Barangay Information and Service Management System © 2025 - All
                Rights Reserved.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
