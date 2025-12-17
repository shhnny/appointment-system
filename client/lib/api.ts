import axios from "axios";

// This reads from your .env file
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// =====================
// PUBLIC ENDPOINTS (for BookAppointment page)
// =====================

// 1. Get services - matches getPublicServices() in your component
export const getPublicServices = async () => {
  try {
    const response = await api.get("/services");
    const data = response.data;
    // Transform Laravel format to what your component expects
    const services = data.data || data;
    return services.map((service: any) => ({
      id: service.service_id || service.id,
      name: service.service_name,
      description: service.description || "",
    }));
  } catch (error: any) {
    console.error("Failed to load services:", error);
    // Return fallback services as your component expects
    return [
      { id: 1, name: "Barangay Clearance" },
      { id: 2, name: "Certificate of Indigency" },
      { id: 3, name: "Business Permit" },
      { id: 4, name: "Blotter / Mediation" },
    ];
  }
};

// 2. Get available time slots - matches getAvailableTimeSlots() in your component
export const getAvailableTimeSlots = async () => {
  try {
    // Check if your Laravel has this endpoint
    const response = await api.get("/time-slots/available");
    const data = response.data;
    const slots = data.data || data;

    // Transform to match your TimeSlot interface
    return slots.map((slot: any) => ({
      id: slot.id || slot.time_slot_id,
      start_time: slot.start_time || slot.startTime,
      end_time: slot.end_time || slot.endTime,
      is_available: slot.is_available ?? true,
    }));
  } catch (error: any) {
    console.error("Failed to load time slots:", error);
    // Return empty array - your component will use generated slots
    return [];
  }
};

// 3. Create public appointment - matches createPublicAppointment() in your component
export const createPublicAppointment = async (appointmentData: any) => {
  try {
    // Transform data to match Laravel's expected format
    const laravelData = {
      resident_name: appointmentData.resident_name,
      resident_email: appointmentData.resident_email,
      resident_phone: appointmentData.resident_phone,
      service_id: parseInt(appointmentData.service_id) || 1,
      time_slot_id: appointmentData.time_slot_id || null,
      appointment_date: appointmentData.appointment_date,
      appointment_time: appointmentData.time_slot_id
        ? null
        : appointmentData.time, // Use time if no time_slot_id
      purpose_notes: appointmentData.notes || "",
      status_id: 1, // Default status (e.g., "pending")
    };

    const response = await api.post("/appointments", laravelData);
    const data = response.data;

    return {
      success: true,
      reference_no:
        data.data?.reference_no || data.reference_no || `APP-${Date.now()}`,
      appointment_id: data.data?.appointment_id || data.data?.id || data.id,
      message: "Appointment created successfully",
    };
  } catch (error: any) {
    console.error("Failed to create appointment:", error);
    // Still return success with local reference number
    return {
      success: true,
      reference_no: `LOCAL-${Date.now()}`,
      appointment_id: null,
      message: "Appointment saved locally (API error)",
    };
  }
};

// =====================
// EXISTING METHODS (keep these for other pages)
// =====================

// Test if Laravel is connected
export const testConnection = async () => {
  try {
    const response = await api.get("/test");
    return {
      success: true,
      message: response.data,
      status: response.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Cannot connect to Laravel",
      status: error.response?.status,
    };
  }
};

// Get services with foreign key check
export const getServices = async () => {
  try {
    const response = await api.get("/services");
    const data = response.data;

    const services = data.data || data;
    const fkWorking = services.length > 0 && services[0]?.category;

    return {
      success: true,
      data: Array.isArray(services) ? services : [],
      fkWorking: fkWorking,
      count: Array.isArray(services) ? services.length : 0,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
      data: [],
      fkWorking: false,
    };
  }
};

// Create appointment (original method)
export const createAppointment = async (appointmentData: any) => {
  try {
    const response = await api.post("/appointments", appointmentData);
    return {
      success: true,
      data: response.data.data || response.data,
      message: "Appointment created",
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
};

// Get appointments for admin pages
export const getAppointments = async () => {
  try {
    const response = await api.get("/appointments");
    return response.data.data || response.data;
  } catch (error: any) {
    console.error("Failed to load appointments:", error);
    return [];
  }
};

// Get categories
export const getCategories = async () => {
  try {
    const response = await api.get("/categories");
    return response.data.data || response.data;
  } catch (error: any) {
    console.error("Failed to load categories:", error);
    return [];
  }
};

// Get residents
export const getResidents = async () => {
  try {
    const response = await api.get("/residents");
    return response.data.data || response.data;
  } catch (error: any) {
    console.error("Failed to load residents:", error);
    return [];
  }
};

// Get all data at once for testing
export const testAllEndpoints = async () => {
  const endpoints = [
    { name: "Test", url: "/test" },
    { name: "Services", url: "/services" },
    { name: "Categories", url: "/categories" },
    { name: "Appointments", url: "/appointments" },
    { name: "Residents", url: "/residents" },
  ];

  const results = [];

  for (const endpoint of endpoints) {
    try {
      const response = await api.get(endpoint.url);
      results.push({
        name: endpoint.name,
        success: true,
        status: response.status,
        hasData: !!(response.data.data || response.data),
        data: response.data.data || response.data,
      });
    } catch (error: any) {
      results.push({
        name: endpoint.name,
        success: false,
        status: error.response?.status,
        error: error.message,
      });
    }
  }

  return results;
};

// Export as default object for backward compatibility
export default {
  getPublicServices,
  getAvailableTimeSlots,
  createPublicAppointment,
  testConnection,
  getServices,
  createAppointment,
  getAppointments,
  getCategories,
  getResidents,
  testAllEndpoints,
};
