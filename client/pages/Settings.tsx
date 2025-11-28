import AdminHeader from "@/components/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar";
import { useEffect, useState } from "react";

interface BarangayInfo {
  name: string;
  captain: string;
  address: string;
  contact: string;
}

interface OfficeHours {
  start: string;
  end: string;
}

interface AppointmentConfig {
  duration: string;
  dailyLimit: string;
  services: string[];
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  message: string;
}

interface ChangeLogEntry {
  id: string;
  date: string;
  change: string;
  user: string;
}

export default function Settings() {
  const [showChangeLog, setShowChangeLog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // Barangay Information State
  const [barangayInfo, setBarangayInfo] = useState<BarangayInfo>({
    name: "JP Rizal",
    captain: "Kipkip Moran",
    address: "123 Rizal Street, Butuan City",
    contact: "0989-123-4567",
  });

  // Office Hours State
  const [officeHours, setOfficeHours] = useState<OfficeHours>({
    start: "8:00 AM",
    end: "5:00 PM",
  });

  // Appointment Configuration State
  const [appointmentConfig, setAppointmentConfig] = useState<AppointmentConfig>(
    {
      duration: "30 mins",
      dailyLimit: "50 residents",
      services: [
        "Barangay Clearance",
        "Certificate of Indigency",
        "Blotter / Mediation",
        "Business Permit",
        "Health Certificate",
      ],
    },
  );

  // Notification Settings State
  const [notifications, setNotifications] = useState<NotificationSettings>({
    email: true,
    sms: false,
    message: "Your appointment is confirmed",
  });

  // Change Log State
  const [changeLog, setChangeLog] = useState<ChangeLogEntry[]>([]);
  const [newService, setNewService] = useState("");

  // Load saved settings from localStorage
  useEffect(() => {
    const savedBarangayInfo = localStorage.getItem("barangay-info");
    const savedOfficeHours = localStorage.getItem("office-hours");
    const savedAppointmentConfig = localStorage.getItem("appointment-config");
    const savedNotifications = localStorage.getItem("notification-settings");
    const savedChangeLog = localStorage.getItem("change-log");

    if (savedBarangayInfo) setBarangayInfo(JSON.parse(savedBarangayInfo));
    if (savedOfficeHours) setOfficeHours(JSON.parse(savedOfficeHours));
    if (savedAppointmentConfig)
      setAppointmentConfig(JSON.parse(savedAppointmentConfig));
    if (savedNotifications) setNotifications(JSON.parse(savedNotifications));
    if (savedChangeLog) setChangeLog(JSON.parse(savedChangeLog));
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("barangay-info", JSON.stringify(barangayInfo));
  }, [barangayInfo]);

  useEffect(() => {
    localStorage.setItem("office-hours", JSON.stringify(officeHours));
  }, [officeHours]);

  useEffect(() => {
    localStorage.setItem(
      "appointment-config",
      JSON.stringify(appointmentConfig),
    );
  }, [appointmentConfig]);

  useEffect(() => {
    localStorage.setItem(
      "notification-settings",
      JSON.stringify(notifications),
    );
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("change-log", JSON.stringify(changeLog));
  }, [changeLog]);

  // Barangay Information Functions
  const handleBarangayInfoChange = (
    field: keyof BarangayInfo,
    value: string,
  ) => {
    setBarangayInfo((prev) => ({ ...prev, [field]: value }));
    addChangeLog(`Updated ${field} to: ${value}`);
  };

  const saveBarangayInfo = () => {
    setIsEditing(false);
    addChangeLog("Saved barangay information changes");
  };

  // Office Hours Functions
  const handleOfficeHoursChange = (field: keyof OfficeHours, value: string) => {
    setOfficeHours((prev) => ({ ...prev, [field]: value }));
    addChangeLog(`Updated office ${field} time to: ${value}`);
  };

  // Appointment Configuration Functions
  const handleDurationChange = (duration: string) => {
    setAppointmentConfig((prev) => ({ ...prev, duration }));
    addChangeLog(`Changed appointment duration to: ${duration}`);
  };

  const handleDailyLimitChange = (limit: string) => {
    setAppointmentConfig((prev) => ({ ...prev, dailyLimit: limit }));
    addChangeLog(`Changed daily appointment limit to: ${limit}`);
  };

  const addService = () => {
    if (
      newService.trim() &&
      !appointmentConfig.services.includes(newService.trim())
    ) {
      setAppointmentConfig((prev) => ({
        ...prev,
        services: [...prev.services, newService.trim()],
      }));
      addChangeLog(`Added new service: ${newService.trim()}`);
      setNewService("");
    }
  };

  const removeService = (service: string) => {
    setAppointmentConfig((prev) => ({
      ...prev,
      services: prev.services.filter((s) => s !== service),
    }));
    addChangeLog(`Removed service: ${service}`);
  };

  const moveService = (index: number, direction: "up" | "down") => {
    const services = [...appointmentConfig.services];
    if (direction === "up" && index > 0) {
      [services[index], services[index - 1]] = [
        services[index - 1],
        services[index],
      ];
    } else if (direction === "down" && index < services.length - 1) {
      [services[index], services[index + 1]] = [
        services[index + 1],
        services[index],
      ];
    }
    setAppointmentConfig((prev) => ({ ...prev, services }));
    addChangeLog(`Reordered services`);
  };

  // Notification Settings Functions
  const toggleEmailNotifications = () => {
    setNotifications((prev) => ({ ...prev, email: !prev.email }));
    addChangeLog(
      `${!notifications.email ? "Enabled" : "Disabled"} email notifications`,
    );
  };

  const toggleSMSNotifications = () => {
    setNotifications((prev) => ({ ...prev, sms: !prev.sms }));
    addChangeLog(
      `${!notifications.sms ? "Enabled" : "Disabled"} SMS notifications`,
    );
  };

  const handleMessageChange = (message: string) => {
    setNotifications((prev) => ({ ...prev, message }));
    addChangeLog(`Updated notification message`);
  };

  // Change Log Functions
  const addChangeLog = (change: string) => {
    const newEntry: ChangeLogEntry = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toLocaleString(),
      change,
      user: "Yul Francis G. Deberto",
    };
    setChangeLog((prev) => [newEntry, ...prev.slice(0, 49)]);
  };

  const clearChangeLog = () => {
    setChangeLog([]);
  };

  // Security Functions
  const changeAdminPassword = () => {
    const newPassword = prompt("Enter new admin password:");
    if (newPassword) {
      addChangeLog("Admin password changed");
      alert("Password changed successfully!");
    }
  };

  // Time options for office hours
  const timeOptions = [
    "8:00 AM",
    "8:30 AM",
    "9:00 AM",
    "9:30 AM",
    "10:00 AM",
    "10:30 AM",
    "11:00 AM",
    "11:30 AM",
    "12:00 PM",
    "1:00 PM",
    "1:30 PM",
    "2:00 PM",
    "2:30 PM",
    "3:00 PM",
    "3:30 PM",
    "4:00 PM",
    "4:30 PM",
    "5:00 PM",
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-foreground mb-6">
              Settings
            </h1>

            {/* Settings Tabs */}
            <div className="flex gap-2 mb-6 border-b border-border">
              {["general", "appointments", "notifications", "security"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-semibold capitalize ${activeTab === tab
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-foreground"
                      }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - General & Appointments */}
              <div className="lg:col-span-2 space-y-6">
                {/* General Settings */}
                {activeTab === "general" && (
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden">
                        <img
                          src="/assets/JP RIZAL.png"
                          alt="Barangay JP Rizal Logo"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h2 className="text-xl font-bold text-foreground">
                        Barangay Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Barangay Name
                        </label>
                        <input
                          type="text"
                          value={barangayInfo.name}
                          onChange={(e) =>
                            handleBarangayInfoChange("name", e.target.value)
                          }
                          className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Barangay Captain
                        </label>
                        <input
                          type="text"
                          value={barangayInfo.captain}
                          onChange={(e) =>
                            handleBarangayInfoChange("captain", e.target.value)
                          }
                          className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Address
                        </label>
                        <input
                          type="text"
                          value={barangayInfo.address}
                          onChange={(e) =>
                            handleBarangayInfoChange("address", e.target.value)
                          }
                          className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Contact Number
                        </label>
                        <input
                          type="text"
                          value={barangayInfo.contact}
                          onChange={(e) =>
                            handleBarangayInfoChange("contact", e.target.value)
                          }
                          className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={saveBarangayInfo}
                        className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => setShowChangeLog(!showChangeLog)}
                        className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold"
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
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Change Log
                      </button>
                    </div>

                    {/* Change Log */}
                    {showChangeLog && (
                      <div className="mt-6 border-t border-border pt-4">
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="font-semibold text-foreground">
                            Recent Changes
                          </h3>
                          <button
                            onClick={clearChangeLog}
                            className="text-sm text-red-500 hover:text-red-600 font-semibold"
                          >
                            Clear Log
                          </button>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {changeLog.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                              No changes recorded
                            </p>
                          ) : (
                            changeLog.map((entry) => (
                              <div
                                key={entry.id}
                                className="text-sm border-l-4 border-primary pl-3 py-1"
                              >
                                <p className="text-foreground">
                                  {entry.change}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {entry.date} by {entry.user}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Appointment Configuration */}
                {activeTab === "appointments" && (
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      Appointment Configuration
                    </h2>

                    <div className="space-y-6">
                      {/* Office hours */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">
                          Set office hours
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <select
                              value={officeHours.start}
                              onChange={(e) =>
                                handleOfficeHoursChange("start", e.target.value)
                              }
                              className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                            >
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <select
                              value={officeHours.end}
                              onChange={(e) =>
                                handleOfficeHoursChange("end", e.target.value)
                              }
                              className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                            >
                              {timeOptions.map((time) => (
                                <option key={time} value={time}>
                                  {time}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Duration and limit */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Duration per appointment
                          </label>
                          <select
                            value={appointmentConfig.duration}
                            onChange={(e) =>
                              handleDurationChange(e.target.value)
                            }
                            className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                          >
                            <option value="15 mins">15 mins</option>
                            <option value="30 mins">30 mins</option>
                            <option value="45 mins">45 mins</option>
                            <option value="60 mins">60 mins</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-foreground mb-2">
                            Limit number of appointments per day
                          </label>
                          <select
                            value={appointmentConfig.dailyLimit}
                            onChange={(e) =>
                              handleDailyLimitChange(e.target.value)
                            }
                            className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                          >
                            <option value="25 residents">25 residents</option>
                            <option value="50 residents">50 residents</option>
                            <option value="75 residents">75 residents</option>
                            <option value="100 residents">100 residents</option>
                            <option value="150 residents">150 residents</option>
                          </select>
                        </div>
                      </div>

                      {/* Services */}
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">
                          Edit appointment services
                        </label>
                        <div className="space-y-2">
                          {appointmentConfig.services.map((service, index) => (
                            <div
                              key={service}
                              className="flex items-center justify-between p-3 bg-muted rounded-lg"
                            >
                              <span className="text-foreground">{service}</span>
                              <div className="flex gap-1">
                                <button
                                  onClick={() => moveService(index, "up")}
                                  disabled={index === 0}
                                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                                >
                                  ↑
                                </button>
                                <button
                                  onClick={() => moveService(index, "down")}
                                  disabled={
                                    index ===
                                    appointmentConfig.services.length - 1
                                  }
                                  className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                                >
                                  ↓
                                </button>
                                <button
                                  onClick={() => removeService(service)}
                                  className="p-1 text-red-500 hover:text-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2 mt-3">
                          <input
                            type="text"
                            value={newService}
                            onChange={(e) => setNewService(e.target.value)}
                            placeholder="Add new service..."
                            className="flex-1 px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                          />
                          <button
                            onClick={addService}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold"
                          >
                            Add Service
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications Tab */}
                {activeTab === "notifications" && (
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      Notification Settings
                    </h2>

                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <span className="block font-semibold text-foreground mb-1">
                            Email Notifications
                          </span>
                          <p className="text-sm text-muted-foreground">
                            Receive appointment updates via email
                          </p>
                        </div>
                        <button
                          onClick={toggleEmailNotifications}
                          className={`w-12 h-6 rounded-full transition-colors ${notifications.email ? "bg-primary" : "bg-gray-300"
                            }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications.email
                              ? "transform translate-x-7"
                              : "transform translate-x-1"
                              }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                        <div>
                          <span className="block font-semibold text-foreground mb-1">
                            SMS Notifications
                          </span>
                          <p className="text-sm text-muted-foreground">
                            Receive appointment updates via SMS
                          </p>
                        </div>
                        <button
                          onClick={toggleSMSNotifications}
                          className={`w-12 h-6 rounded-full transition-colors ${notifications.sms ? "bg-primary" : "bg-gray-300"
                            }`}
                        >
                          <div
                            className={`w-4 h-4 bg-white rounded-full transition-transform ${notifications.sms
                              ? "transform translate-x-7"
                              : "transform translate-x-1"
                              }`}
                          />
                        </button>
                      </div>

                      <div>
                        <label className="block font-semibold text-foreground mb-2">
                          Default Notification Message
                        </label>
                        <textarea
                          value={notifications.message}
                          onChange={(e) => handleMessageChange(e.target.value)}
                          rows={3}
                          className="w-full px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          This message will be sent for confirmed appointments
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Tab */}
                {activeTab === "security" && (
                  <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                    <h2 className="text-xl font-bold text-foreground mb-6">
                      Security Settings
                    </h2>

                    <div className="space-y-6">
                      <div className="p-4 bg-muted rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">
                          Admin Password
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Change your administrator password regularly for
                          security
                        </p>
                        <button
                          onClick={changeAdminPassword}
                          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold"
                        >
                          Change Password
                        </button>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">
                          System Information
                        </h3>
                        <div className="text-sm space-y-1">
                          <p>
                            <strong>Last Login:</strong>{" "}
                            {new Date().toLocaleString()}
                          </p>
                          <p>
                            <strong>Session Active:</strong> Yes
                          </p>
                          <p>
                            <strong>System Version:</strong> 1.0.0
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right column - Profile and Quick Settings */}
              <div className="space-y-6">
                {/* Profile section */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Profile
                  </h3>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-xl mb-3">
                      YG
                    </div>
                    <h4 className="font-semibold text-foreground">
                      Yul Francis G. Deberto
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Barangay JP Rizal Secretary
                    </p>
                    <div className="mt-4 space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Status</span>
                        <p className="text-status-confirmed">● Active</p>
                      </div>
                      <div>
                        <span className="font-semibold">Last Login</span>
                        <p className="text-muted-foreground">
                          {new Date().toLocaleDateString()} -{" "}
                          {new Date().toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setActiveTab("appointments")}
                      className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 text-sm font-semibold text-left"
                    >
                      📅 Manage Appointments
                    </button>
                    <button
                      onClick={() => setActiveTab("notifications")}
                      className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 text-sm font-semibold text-left"
                    >
                      🔔 Notification Settings
                    </button>
                    <button
                      onClick={changeAdminPassword}
                      className="w-full px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 text-sm font-semibold text-left"
                    >
                      🔒 Change Password
                    </button>
                  </div>
                </div>

                {/* System Status */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-border">
                  <h3 className="text-lg font-bold text-foreground mb-4">
                    System Status
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Appointments Today:</span>
                      <span className="font-semibold">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pending Requests:</span>
                      <span className="font-semibold text-yellow-500">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Uptime:</span>
                      <span className="font-semibold text-green-500">
                        99.9%
                      </span>
                    </div>
                  </div>
                </div>
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
