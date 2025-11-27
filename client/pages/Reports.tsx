import { useEffect, useState } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { storage } from "@/lib/storage";

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
  service: string;
  count: number;
  percent: string;
}

interface BookingOutcome {
  status: string;
  count: number;
  percent: string;
}

export default function Reports() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [serviceDemand, setServiceDemand] = useState<ServiceDemand[]>([]);
  const [bookingOutcome, setBookingOutcome] = useState<BookingOutcome[]>([]);

  useEffect(() => {
    const saved = storage.getAppointments();
    setAppointments(saved);
    calculateServiceDemand(saved);
    calculateBookingOutcome(saved);
  }, []);

  const calculateServiceDemand = (appts: Appointment[]) => {
    if (appts.length === 0) {
      setServiceDemand([
        { rank: "1", service: "Barangay Clearance", count: 0, percent: "0%" },
        {
          rank: "2",
          service: "Certificate of Indigency",
          count: 0,
          percent: "0%",
        },
        { rank: "3", service: "Blotter / Mediation", count: 0, percent: "0%" },
      ]);
      return;
    }

    // Count service demand
    const serviceCount: { [key: string]: number } = {};

    appts.forEach((appt) => {
      serviceCount[appt.purpose] = (serviceCount[appt.purpose] || 0) + 1;
    });

    // Convert to array and sort by count (descending)
    const sortedServices = Object.entries(serviceCount)
      .map(([service, count]) => ({
        service,
        count,
        percent: ((count / appts.length) * 100).toFixed(1) + "%",
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3); // Top 3 services

    // Fill with default services if needed
    const defaultServices = [
      "Barangay Clearance",
      "Certificate of Indigency",
      "Blotter / Mediation",
    ];

    const result: ServiceDemand[] = [];

    // Add ranked services
    sortedServices.forEach((item, index) => {
      result.push({
        rank: (index + 1).toString(),
        service: item.service,
        count: item.count,
        percent: item.percent,
      });
    });

    // Add remaining default services with zero counts
    for (let i = result.length; i < 3; i++) {
      result.push({
        rank: (i + 1).toString(),
        service: defaultServices[i],
        count: 0,
        percent: "0%",
      });
    }

    setServiceDemand(result);
  };

  const calculateBookingOutcome = (appts: Appointment[]) => {
    if (appts.length === 0) {
      setBookingOutcome([
        { status: "No Show", count: 0, percent: "0%" },
        { status: "Completed (showed up)", count: 0, percent: "0%" },
        { status: "Total", count: 0, percent: "0%" },
        { status: "Completion Rate", count: 0, percent: "0%" },
      ]);
      return;
    }

    const statusCount: { [key: string]: number } = {};

    appts.forEach((appt) => {
      statusCount[appt.status] = (statusCount[appt.status] || 0) + 1;
    });

    const totalAppointments = appts.length;
    const completedCount = statusCount["Completed"] || 0;
    const noShowCount = statusCount["Cancelled"] || 0; // Assuming cancelled = no show
    const confirmedCount = statusCount["Confirmed"] || 0;
    const pendingCount = statusCount["Pending"] || 0;

    const completionRate =
      totalAppointments > 0
        ? ((completedCount / totalAppointments) * 100).toFixed(1) + "%"
        : "0%";

    const outcome: BookingOutcome[] = [
      {
        status: "No Show",
        count: noShowCount,
        percent:
          totalAppointments > 0
            ? ((noShowCount / totalAppointments) * 100).toFixed(1) + "%"
            : "0%",
      },
      {
        status: "Completed (showed up)",
        count: completedCount,
        percent:
          totalAppointments > 0
            ? ((completedCount / totalAppointments) * 100).toFixed(1) + "%"
            : "0%",
      },
      {
        status: "Total",
        count: totalAppointments,
        percent: "100%",
      },
      {
        status: "Completion Rate",
        count: completedCount,
        percent: completionRate,
      },
    ];

    setBookingOutcome(outcome);
  };

  const totalAppointments = appointments.length;
  const pendingCount = appointments.filter(
    (a) => a.status === "Pending",
  ).length;
  const confirmedCount = appointments.filter(
    (a) => a.status === "Confirmed",
  ).length;
  const completedCount = appointments.filter(
    (a) => a.status === "Completed",
  ).length;
  const cancelledCount = appointments.filter(
    (a) => a.status === "Cancelled",
  ).length;

  const pendingRate =
    totalAppointments > 0
      ? Math.round((pendingCount / totalAppointments) * 100)
      : 0;
  const confirmedRate =
    totalAppointments > 0
      ? Math.round((confirmedCount / totalAppointments) * 100)
      : 0;
  const completionRate =
    totalAppointments > 0
      ? Math.round((completedCount / totalAppointments) * 100)
      : 0;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <AdminHeader />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Reports and Analytics
            </h1>

            {/* Key metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">
                  Total Appointments
                </p>
                <p className="text-4xl font-bold text-foreground">
                  {totalAppointments}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">
                  Pending Rate
                </p>
                <p className="text-4xl font-bold text-foreground">
                  {pendingRate}%
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                <p className="text-muted-foreground text-sm mb-2">
                  Completion Rate
                </p>
                <p className="text-4xl font-bold text-foreground">
                  {completionRate}%
                </p>
              </div>
            </div>

            {/* Status Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-yellow-800 text-sm font-semibold">Pending</p>
                <p className="text-2xl font-bold text-yellow-800">
                  {pendingCount}
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-green-800 text-sm font-semibold">
                  Confirmed
                </p>
                <p className="text-2xl font-bold text-green-800">
                  {confirmedCount}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <p className="text-blue-800 text-sm font-semibold">Completed</p>
                <p className="text-2xl font-bold text-blue-800">
                  {completedCount}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-red-800 text-sm font-semibold">Cancelled</p>
                <p className="text-2xl font-bold text-red-800">
                  {cancelledCount}
                </p>
              </div>
            </div>

            {/* Reports grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Demand Ranking */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Service Demand Ranking
                </h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-sm font-semibold text-muted-foreground">
                        Rank
                      </th>
                      <th className="text-left py-2 text-sm font-semibold text-muted-foreground">
                        Service
                      </th>
                      <th className="text-left py-2 text-sm font-semibold text-muted-foreground">
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
                        <td className="py-3 text-sm text-foreground font-semibold">
                          {item.rank}
                        </td>
                        <td className="py-3 text-sm text-foreground">
                          {item.service}
                        </td>
                        <td className="py-3 text-sm text-foreground">
                          {item.count} ({item.percent})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {totalAppointments === 0 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    No appointment data available
                  </p>
                )}
              </div>

              {/* Booking Outcome & Compliance */}
              <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                <h2 className="text-lg font-bold text-foreground mb-4">
                  Booking Outcome & Compliance
                </h2>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-2 text-sm font-semibold text-muted-foreground">
                        Status Outcome
                      </th>
                      <th className="text-left py-2 text-sm font-semibold text-muted-foreground">
                        Count
                      </th>
                      <th className="text-left py-2 text-sm font-semibold text-muted-foreground">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingOutcome.map((item, idx) => {
                      const isCompleted =
                        item.status === "Completed (showed up)";
                      const isTotal = item.status === "Total";
                      const isCompletionRate =
                        item.status === "Completion Rate";

                      return (
                        <tr
                          key={idx}
                          className={`border-b border-border ${
                            isCompleted
                              ? "bg-secondary/10"
                              : isTotal
                                ? "bg-yellow-50"
                                : "hover:bg-muted"
                          }`}
                        >
                          <td
                            className={`py-3 text-sm ${
                              isCompleted || isTotal || isCompletionRate
                                ? "text-foreground font-semibold"
                                : "text-foreground"
                            }`}
                          >
                            {item.status}
                          </td>
                          <td
                            className={`py-3 text-sm ${
                              isCompleted || isTotal || isCompletionRate
                                ? "text-foreground font-semibold"
                                : "text-foreground"
                            }`}
                          >
                            {isCompletionRate ? "-" : item.count}
                          </td>
                          <td
                            className={`py-3 text-sm ${
                              isCompleted || isTotal || isCompletionRate
                                ? "text-foreground font-semibold"
                                : "text-foreground"
                            }`}
                          >
                            {item.percent}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {totalAppointments === 0 && (
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    No booking outcome data available
                  </p>
                )}
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
