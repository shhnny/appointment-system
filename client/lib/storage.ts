export interface Appointment {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  purpose: string;
  status: string;
}

export const storage = {
  getAppointments: (): Appointment[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem("appointments");
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      return [];
    }
  },

  saveAppointment: (appointment: Appointment) => {
    if (typeof window === "undefined") return;
    try {
      const appointments = storage.getAppointments();
      const existingIndex = appointments.findIndex(
        (a) => a.id === appointment.id,
      );

      if (existingIndex >= 0) {
        appointments[existingIndex] = appointment;
      } else {
        appointments.push(appointment);
      }

      localStorage.setItem("appointments", JSON.stringify(appointments));
    } catch (error) {
      console.error("Error saving appointment:", error);
    }
  },

  saveAppointments: (appointments: Appointment[]) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("appointments", JSON.stringify(appointments));
    } catch (error) {
      console.error("Error saving appointments:", error);
    }
  },

  clearAll: () => {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem("appointments");
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  },

  getLogin: () => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem("admin-login");
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  },

  saveLogin: (email: string, password: string) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem("admin-login", JSON.stringify({ email, password }));
    } catch (error) {
      console.error("Error saving login:", error);
    }
  },
};
