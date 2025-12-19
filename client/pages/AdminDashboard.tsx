import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import { Appointment } from "@/interfaces/appointment.interface";
import { API_BASE_URL } from "@/services/api";
import { useEffect, useState } from "react";

interface ServiceDemand {
  rank: string;
  count: number;
  percent: string;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [serviceDemand, setServiceDemand] = useState<ServiceDemand[]>([]);
  const [currentDate, setCurrentDate] = useState("");
  const [currentGreeting, setCurrentGreeting] = useState("");

  useEffect(() => {
    async function fetchAppointments() {
      const response = await fetch(`${API_BASE_URL}/appointments`);
      const data = await response.json();

      console.log("data: ", data);
      const sortedAppointments = (data.data || []).sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`).getTime();
        const dateB = new Date(`${b.date} ${b.time}`).getTime();
        return dateB - dateA;
      });

      setAppointments(sortedAppointments);
      calculateServiceDemand(sortedAppointments);
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

  const calculateServiceDemand = (appts: Appointment[]) => {
    if (appts.length === 0) {
      setServiceDemand([
        { rank: "1. Barangay Clearance", count: 0, percent: "0%" },
        { rank: "2. Certificate of Indigency", count: 0, percent: "0%" },
        { rank: "3. Blotter / Mediation", count: 0, percent: "0%" },
      ]);
      return;
    }

    const serviceCount: { [key: string]: number } = {};

    appts.forEach((appt) => {
      serviceCount[appt.service.service_name] =
        (serviceCount[appt.service.service_name] || 0) + 1;
    });

    const sortedServices = Object.entries(serviceCount)
      .map(([purpose, count]) => ({
        purpose,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Top 3

    const total = appts.length;
    const demandData = sortedServices.map((service, index) => ({
      rank: `${index + 1}. ${service.purpose}`,
      count: service.count,
      percent:
        total > 0 ? `${((service.count / total) * 100).toFixed(1)}%` : "0%",
    }));

    while (demandData.length < 3) {
      const defaultServices = [
        "Barangay Clearance",
        "Certificate of Indigency",
        "Blotter / Mediation",
      ];
      demandData.push({
        rank: `${demandData.length + 1}. ${defaultServices[demandData.length]}`,
        count: 0,
        percent: "0%",
      });
    }

    setServiceDemand(demandData);
  };

  useEffect(() => {
    calculateServiceDemand(appointments);
  }, [appointments]);

  const updateAppointmentStatus = (id: string, newStatus: string) => {
    const updatedAppointments = appointments.map((appt) =>
      appt.reference_no === id
        ? { ...appt, status: { status_name: newStatus } }
        : appt,
    );
    setAppointments(updatedAppointments);
  };

  const deleteAppointment = (id: string) => {
    const filteredAppointments = appointments.filter(
      (appt) => appt.reference_no !== id,
    );
    setAppointments(filteredAppointments);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Confirmed":
        return "bg-green-500 text-white";
      case "Completed":
        return "bg-blue-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />
      {/* Main content */}
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

            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {/* Total Appointments */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Appointments
                    </p>
                    <p className="text-3xl font-bold text-foreground mt-2">
                      {appointments.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">TOTAL</p>
                  </div>
                </div>
              </div>

              {/* Pending Requests */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Pending Requests
                    </p>
                    <p className="text-3xl font-bold text-yellow-500 mt-2">
                      {
                        appointments.filter(
                          (a) => a.status.status_name === "Pending",
                        ).length
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">TOTAL</p>
                  </div>
                </div>
              </div>

              {/* Approved Appointments */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Approved Appointments
                    </p>
                    <p className="text-3xl font-bold text-green-500 mt-2">
                      {
                        appointments.filter(
                          (a) => a.status.status_name === "Confirmed",
                        ).length
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">TOTAL</p>
                  </div>
                </div>
              </div>

              {/* Completed Appointments */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Completed Appointments
                    </p>
                    <p className="text-3xl font-bold text-blue-500 mt-2">
                      {
                        appointments.filter(
                          (a) => a.status.status_name === "Completed",
                        ).length
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">TOTAL</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Analytics */}
              <div className="lg:col-span-3 space-y-6">
                {" "}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                  <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                    <span></span>Reports and Analytics
                  </h2>

                  <div className="mb-6">
                    <h3 className="font-semibold text-foreground mb-4">
                      Service Demand Ranking
                    </h3>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-2 text-sm font-semibold text-muted-foreground">
                            Rank
                          </th>
                          <th className="text-left py-2 px-2 text-sm font-semibold text-muted-foreground">
                            Total Request
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {serviceDemand.map((item, idx) => (
                          <tr
                            key={idx}
                            className="border-b border-border hover:bg-muted"
                          >
                            <td className="py-3 px-2 text-sm text-foreground">
                              {item.rank}
                            </td>
                            <td className="py-3 px-2 text-sm text-foreground">
                              {item.count} ({item.percent})
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold text-foreground">
                      Appointments
                    </h3>
                    <span className="text-sm text-muted-foreground">
                      Showing {Math.min(appointments.length, 10)} of{" "}
                      {appointments.length}
                    </span>
                  </div>

                  {/* Scrollable container with wider layout */}
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-white z-10">
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground">
                            Name
                          </th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground">
                            Service
                          </th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground">
                            Date & Time
                          </th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground">
                            Phone
                          </th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground">
                            Status
                          </th>
                          <th className="text-left py-3 px-3 font-semibold text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-8 px-3 text-center text-muted-foreground"
                            >
                              No appointments yet.
                            </td>
                          </tr>
                        ) : (
                          appointments.slice(0, 10).map((item) => (
                            <tr
                              key={item.reference_no}
                              className="border-b border-border hover:bg-muted"
                            >
                              <td className="py-3 px-3 text-foreground">
                                {item.resident.full_name}
                              </td>
                              <td className="py-3 px-3 text-foreground">
                                {item.service.service_name}
                              </td>
                              <td className="py-3 px-3 text-foreground">
                                {item.time_slot.slot_date} @{" "}
                                {item.time_slot.start_time}
                              </td>
                              <td className="py-3 px-3 text-foreground">
                                {item.resident.phone_number}
                              </td>
                              <td className="py-3 px-3">
                                <span
                                  className={`${getStatusClass(item.status.status_name)} px-3 py-1 rounded-full text-xs font-semibold`}
                                >
                                  {item.status.status_name}
                                </span>
                              </td>
                              <td className="py-3 px-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      updateAppointmentStatus(
                                        item.reference_no,
                                        "Confirmed",
                                      )
                                    }
                                    className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() =>
                                      deleteAppointment(item.reference_no)
                                    }
                                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
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
