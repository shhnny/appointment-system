import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import { storage } from "@/lib/storage";
import { useEffect, useState } from "react";

interface Appointment {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  purpose: string;
  status: string;
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [currentDate, setCurrentDate] = useState("");
  const [currentGreeting, setCurrentGreeting] = useState("");

  useEffect(() => {
    const saved = storage.getAppointments();
    setAppointments(saved);

    // MOVE THE DATE AND GREETING LOGIC INSIDE useEffect
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
  }, []); // Empty dependency array means this runs once on mount

  const updateStatus = (id: string, newStatus: string) => {
    const updated = appointments.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app,
    );
    setAppointments(updated);
    storage.saveAppointments(updated);
  };

  const filtered =
    filterStatus === "All Status"
      ? appointments
      : appointments.filter((app) => app.status === filterStatus);

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader currentDate={currentDate} />

        <main className="flex-1 overflow-auto  transition-all duration-75">
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">
                {currentGreeting} Yul!
              </h1>
              <p className="text-muted-foreground">
                {currentDate || "Loading date..."}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-border">
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-foreground">
                    Appointments
                  </h2>
                  <div className="flex gap-3">
                    <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                      Pending:{" "}
                      {
                        appointments.filter((a) => a.status === "Pending")
                          .length
                      }
                    </span>
                    <span className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm font-semibold">
                      Today's: {appointments.length}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <select className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary">
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                  </select>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Confirmed</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>

                  <input
                    type="text"
                    placeholder="Search appointments..."
                    className="flex-1 px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-gray-50">
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-sm">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-sm">
                        Date & Time
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-sm">
                        Resident Name
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-sm">
                        Service
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-sm">
                        Ref. No
                      </th>
                      <th className="text-left py-4 px-6 font-semibold text-muted-foreground text-sm">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-8 px-6 text-center text-muted-foreground"
                        >
                          No appointments found
                        </td>
                      </tr>
                    ) : (
                      filtered.map((item) => {
                        const statusColor =
                          item.status === "Pending"
                            ? "bg-yellow-500"
                            : item.status === "Confirmed"
                              ? "bg-green-500"
                              : item.status === "Completed"
                                ? "bg-blue-500"
                                : "bg-red-500";

                        return (
                          <tr
                            key={item.id}
                            className="border-b border-border hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <select
                                value={item.status}
                                onChange={(e) =>
                                  updateStatus(item.id, e.target.value)
                                }
                                className={`${statusColor} text-white px-3 py-1 rounded-full text-xs font-semibold border-0 cursor-pointer`}
                              >
                                <option value="Pending">Pending</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-4 px-6 text-sm text-foreground">
                              {item.date} @ {item.time}
                            </td>
                            <td className="py-4 px-6 text-sm text-foreground font-medium">
                              {item.fullName}
                            </td>
                            <td className="py-4 px-6 text-sm text-foreground">
                              {item.purpose}
                            </td>
                            <td className="py-4 px-6 text-sm text-foreground font-semibold">
                              #{item.id.slice(-4)}
                            </td>
                            <td className="py-4 px-6 text-sm">
                              <button className="text-primary hover:text-primary/80 font-semibold">
                                View
                              </button>
                            </td>
                          </tr>
                        );
                      })
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
