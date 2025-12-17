import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import { Appointment } from "@/interfaces/appointment.interface";
import { API_BASE_URL } from "@/services/api";
import { useEffect, useState } from "react";

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [currentDate, setCurrentDate] = useState("");
  const [currentGreeting, setCurrentGreeting] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAppointments() {
      const response = await fetch(`${API_BASE_URL}/appointments`);
      const data = await response.json();

      console.log("data: ", data)
      setAppointments(data.data);
    }

    fetchAppointments();
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

  const updateStatus = (id: number, newStatus: string) => {

  };

  const handleViewAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const filtered =
    filterStatus === "All Status"
      ? appointments
      : appointments.filter((app) => app.status.status_name === filterStatus);

  // Function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Function to format time for display
  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${period}`;
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader currentDate={currentDate} />

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
                    Appointments
                  </h2>
                  <div className="flex gap-3">
                    <span className="px-3 py-1 bg-yellow-500 text-white rounded-full text-sm font-semibold">
                      Pending:{" "}
                      {
                        appointments.filter((a) => a.status.status_name === "Pending")
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
                        // NORMALIZE THE STATUS FIRST
                        const normalizedStatus =
                          item.status?.toString().trim() || "Pending";
                        const finalStatus =
                          normalizedStatus === "pending" ||
                            normalizedStatus === "Pending"
                            ? "Pending"
                            : normalizedStatus === "confirmed" ||
                              normalizedStatus === "Confirmed"
                              ? "Confirmed"
                              : normalizedStatus === "completed" ||
                                normalizedStatus === "Completed"
                                ? "Completed"
                                : normalizedStatus === "cancelled" ||
                                  normalizedStatus === "Cancelled"
                                  ? "Cancelled"
                                  : "Pending"; // Default to Pending

                        const statusColor =
                          finalStatus === "Pending"
                            ? "bg-yellow-500"
                            : finalStatus === "Confirmed"
                              ? "bg-green-500"
                              : finalStatus === "Completed"
                                ? "bg-blue-500"
                                : "bg-red-500";

                        return (
                          <tr
                            key={item.appointment_id}
                            className="border-b border-border hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-6">
                              <select
                                value={item.status.status_name}
                                onChange={(e) =>
                                  updateStatus(item.appointment_id, e.target.value)
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
                              {item.time_slot.slot_date} @ {item.time_slot.start_time}
                            </td>
                            <td className="py-4 px-6 text-sm text-foreground font-medium">
                              {item.resident.full_name}
                            </td>
                            <td className="py-4 px-6 text-sm text-foreground">
                              {item.service.service_name}
                            </td>
                            <td className="py-4 px-6 text-sm text-foreground font-semibold">
                              {item.reference_no}
                            </td>
                            <td className="py-4 px-6 text-sm">
                              <button
                                onClick={() => handleViewAppointment(item)}
                                className="text-primary hover:text-primary/80 font-semibold"
                              >
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

      {/* Appointment Details Modal */}
      {isModalOpen && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-gradient-to-r from-primary to-primary/80 text-white">
              <div>
                <h3 className="text-xl font-bold">Appointment Details</h3>
                <p className="text-white/90 text-sm mt-1">
                  Reference: #{selectedAppointment.reference_no}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:text-white/80 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      Resident Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">
                          {selectedAppointment.resident.full_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email Address</p>
                        <p className="font-medium">
                          {selectedAppointment.resident.email_address}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium">
                          {selectedAppointment.resident.phone_number}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      Service Requested
                    </h4>
                    <div>
                      <p className="text-sm text-gray-600">Purpose</p>
                      <p className="font-medium">
                        {selectedAppointment.service.service_name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Appointment Details
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Date</p>
                        <p className="font-medium">
                          {formatDate(selectedAppointment.time_slot.slot_date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Time</p>
                        <p className="font-medium">
                          {formatTime(selectedAppointment.time_slot.start_time)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${selectedAppointment.status.status_name === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : selectedAppointment.status.status_name === "Confirmed"
                              ? "bg-green-100 text-green-800"
                              : selectedAppointment.status.status_name === "Completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                        >
                          {selectedAppointment.status.status_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                      Reference Information
                    </h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-600">Appointment ID</p>
                        <p className="font-mono font-medium">
                          {selectedAppointment.appointment_id}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Created</p>
                        <p className="font-medium">
                          {new Date(
                            selectedAppointment.created_at,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => {
                    updateStatus(selectedAppointment.appointment_id, "Confirmed");
                    closeModal();
                  }}
                  className="flex-1 px-3 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Confirm Appointment
                </button>
                <button
                  onClick={() => {
                    updateStatus(selectedAppointment.appointment_id, "Completed");
                    closeModal();
                  }}
                  className="flex-1 px-3 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Mark as Completed
                </button>
                <button
                  onClick={() => {
                    updateStatus(selectedAppointment.appointment_id, "Cancelled");
                    closeModal();
                  }}
                  className="flex-1 px-2 py-1 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Cancel Appointment
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-between">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                Close
              </button>
              <button
                onClick={() => {
                  // You can add email functionality here
                  alert(`Email sent to ${selectedAppointment.resident.email_address}`);
                }}
                className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors"
              >
                Send Email Reminder
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
