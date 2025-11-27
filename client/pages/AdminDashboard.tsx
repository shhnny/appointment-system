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

interface ServiceDemand {
  rank: string;
  count: number;
  percent: string;
}

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [serviceDemand, setServiceDemand] = useState<ServiceDemand[]>([]);
  const [currentDate, setCurrentDate] = useState("");

  // Initialize or reset all data to zero/empty
  const resetData = () => {
    const emptyAppointments: Appointment[] = [];
    const emptyServiceDemand: ServiceDemand[] = [
      {
        rank: "1. Barangay Clearance",
        count: 0,
        percent: "0%",
      },
      {
        rank: "2. Certificate of Indigency",
        count: 0,
        percent: "0%",
      },
      {
        rank: "3. Blotter / Mediation",
        count: 0,
        percent: "0%",
      },
    ];

    setAppointments(emptyAppointments);
    setServiceDemand(emptyServiceDemand);

    // Optionally clear storage as well
    storage.clearAll();
  };

  // Load initial data
  useEffect(() => {
    const savedAppointments = storage.getAppointments();
    setAppointments(savedAppointments || []);

    // Set current date
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    setCurrentDate(now.toLocaleDateString("en-US", options));

    // Calculate service demand from actual appointments
    calculateServiceDemand(savedAppointments || []);
  }, []);

  // Calculate service demand based on actual appointments
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

    // Count each service type
    appts.forEach((appt) => {
      serviceCount[appt.purpose] = (serviceCount[appt.purpose] || 0) + 1;
    });

    // Convert to array and sort by count
    const sortedServices = Object.entries(serviceCount)
      .map(([purpose, count]) => ({
        purpose,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Top 3

    // Calculate percentages
    const total = appts.length;
    const demandData = sortedServices.map((service, index) => ({
      rank: `${index + 1}. ${service.purpose}`,
      count: service.count,
      percent:
        total > 0 ? `${((service.count / total) * 100).toFixed(1)}%` : "0%",
    }));

    // Fill remaining slots with zero data if needed
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

  // Update service demand when appointments change
  useEffect(() => {
    calculateServiceDemand(appointments);
  }, [appointments]);

  // Add sample data for testing (optional)
  const addSampleData = () => {
    const sampleAppointments: Appointment[] = [
      {
        id: "1",
        fullName: "Juan Dela Cruz",
        email: "juan@email.com",
        phone: "09123456789",
        date: "2024-01-15",
        time: "09:00 AM",
        purpose: "Barangay Clearance",
        status: "Pending",
      },
      {
        id: "2",
        fullName: "Maria Santos",
        email: "maria@email.com",
        phone: "09123456780",
        date: "2024-01-16",
        time: "10:30 AM",
        purpose: "Certificate of Indigency",
        status: "Confirmed",
      },
      {
        id: "3",
        fullName: "Pedro Reyes",
        email: "pedro@email.com",
        phone: "09123456781",
        date: "2024-01-17",
        time: "02:00 PM",
        purpose: "Blotter / Mediation",
        status: "Completed",
      },
    ];

    setAppointments(sampleAppointments);
    sampleAppointments.forEach((appt) => storage.saveAppointment(appt));
  };

  // Update appointment status
  const updateAppointmentStatus = (id: string, newStatus: string) => {
    const updatedAppointments = appointments.map((appt) =>
      appt.id === id ? { ...appt, status: newStatus } : appt,
    );
    setAppointments(updatedAppointments);

    // Update in storage as well
    storage.clearAll();
    updatedAppointments.forEach((appt) => storage.saveAppointment(appt));
  };

  // Delete an appointment
  const deleteAppointment = (id: string) => {
    const filteredAppointments = appointments.filter((appt) => appt.id !== id);
    setAppointments(filteredAppointments);

    // Update storage
    storage.clearAll();
    filteredAppointments.forEach((appt) => storage.saveAppointment(appt));
  };

  // Get status badge class
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
        {/* Header */}
        <AdminHeader currentDate={currentDate} />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Welcome section */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">
                Good Morning Yul!
              </h1>
              <p className="text-muted-foreground">
                {currentDate || "Loading date..."}
              </p>
            </div>

            {/* Control buttons for testing */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={resetData}
                className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
              >
                Reset All Data
              </button>
              <button
                onClick={addSampleData}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
              >
                Add Sample Data
              </button>
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
                        appointments.filter((a) => a.status === "Pending")
                          .length
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
                        appointments.filter((a) => a.status === "Confirmed")
                          .length
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
                        appointments.filter((a) => a.status === "Completed")
                          .length
                      }
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">TOTAL</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Analytics */}
              <div className="lg:col-span-2 space-y-6">
                {/* Reports and Analytics */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                  <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                    <span>📊</span> Reports and Analytics
                  </h2>

                  {/* Service Demand Ranking */}
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

                {/* Appointments table */}
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
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-2 px-2 font-semibold text-muted-foreground">
                            Name
                          </th>
                          <th className="text-left py-2 px-2 font-semibold text-muted-foreground">
                            Service
                          </th>
                          <th className="text-left py-2 px-2 font-semibold text-muted-foreground">
                            Date & Time
                          </th>
                          <th className="text-left py-2 px-2 font-semibold text-muted-foreground">
                            Phone
                          </th>
                          <th className="text-left py-2 px-2 font-semibold text-muted-foreground">
                            Status
                          </th>
                          <th className="text-left py-2 px-2 font-semibold text-muted-foreground">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.length === 0 ? (
                          <tr>
                            <td
                              colSpan={6}
                              className="py-8 px-2 text-center text-muted-foreground"
                            >
                              No appointments yet. Click "Add Sample Data" to
                              see demo data.
                            </td>
                          </tr>
                        ) : (
                          appointments.slice(0, 5).map((item) => (
                            <tr
                              key={item.id}
                              className="border-b border-border hover:bg-muted"
                            >
                              <td className="py-3 px-2 text-foreground">
                                {item.fullName}
                              </td>
                              <td className="py-3 px-2 text-foreground">
                                {item.purpose}
                              </td>
                              <td className="py-3 px-2 text-foreground">
                                {item.date} @ {item.time}
                              </td>
                              <td className="py-3 px-2 text-foreground">
                                {item.phone}
                              </td>
                              <td className="py-3 px-2">
                                <span
                                  className={`${getStatusClass(item.status)} px-3 py-1 rounded-full text-xs font-semibold`}
                                >
                                  {item.status}
                                </span>
                              </td>
                              <td className="py-3 px-2">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() =>
                                      updateAppointmentStatus(
                                        item.id,
                                        "Confirmed",
                                      )
                                    }
                                    className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => deleteAppointment(item.id)}
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

              {/* Right column - Empty now since profile card is removed */}
              <div className="space-y-6">
                {/* This space can be used for other widgets in the future */}
              </div>
            </div>

            {/* Footer */}
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
