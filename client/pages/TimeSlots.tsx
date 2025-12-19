import { getTimeSlots } from "@/api/requests/time_slot";
import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import { TimeSlot } from "@/interfaces/time_slot.interface";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function TimeSlots() {
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [currentDate, setCurrentDate] = useState("");
  const [currentGreeting, setCurrentGreeting] = useState("");

  useEffect(() => {
    async function fetchTimeSlots() {
      try {
        const data = await getTimeSlots();
        console.log("data: ", data);
        setSlots(data.data);
      } catch (error) {
        console.log("error:", error);
      }
    }

    fetchTimeSlots();
  }, []);

  useEffect(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString("en-US", options));

    const hour = now.getHours();
    if (hour >= 5 && hour < 12) {
      setCurrentGreeting("Good Morning");
    } else if (hour >= 12 && hour < 18) {
      setCurrentGreeting("Good Afternoon");
    } else {
      setCurrentGreeting("Good Evening");
    }
  }, []);

  function removeSlot() {}

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-auto transition-all duration-75">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">
                {currentGreeting}!
              </h1>
              <p className="text-muted-foreground">
                {currentDate || "Loading date..."}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Time Slots
                  </h2>
                  <Link
                    to={"/admin/create-time-slot"}
                    className="font-medium rounded-lg px-3 py-1 border-2"
                  >
                    + Add slot
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-gray-50">
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-sm">
                        Date & Time
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-sm">
                        Available Slots
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-sm">
                        Max Capacity
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {slots.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 px-6 text-center text-muted-foreground"
                        >
                          No timeslots found
                        </td>
                      </tr>
                    ) : (
                      slots.map((item) => (
                        <tr
                          key={item.timeslot_id}
                          className="border-b border-border hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4 px-6 text-sm text-foreground">
                            {item.slot_date} ({item.start_time} -{" "}
                            {item.end_time})
                          </td>
                          <td className="py-4 px-6 text-sm text-foreground">
                            {item.available_slots}
                          </td>
                          <td className="py-4 px-6 text-sm text-foreground text-green-600">
                            {item.max_capacity}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-muted-foreground py-4 border-t border-border">
              Barangay Information and Service Management System © 2025 - All
              Rights Reserved.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
