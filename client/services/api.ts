// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

console.log('API URL:', API_BASE_URL); // Debugging

// =====================
// TYPE DEFINITIONS
// =====================
export interface HealthCheckResponse {
  status: string;
  message: string;
  app_name: string;
  app_env: string;
  app_debug: boolean;
  timestamp: string;
  laravel_version: string;
  php_version: string;
}

export interface Appointment {
  id: number;
  reference_no: string;
  resident_id: number;
  service_id: number;
  time_slot_id: number;
  appointment_date: string;
  status_id: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  name: string;
  description?: string;
  duration_minutes: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TimeSlot {
  id: number;
  start_time: string;    // Format: "HH:MM:SS"
  end_time: string;      // Format: "HH:MM:SS"
  is_available: boolean;
  max_capacity: number;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  role_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PublicAppointmentRequest {
  resident_name: string;
  resident_email: string;
  resident_phone: string;
  service_id: number | string;
  time_slot_id: number | string;
  appointment_date: string;
  notes?: string;
}

export interface PublicAppointmentResponse {
  id: number;
  reference_no: string;
  resident_name: string;
  resident_email: string;
  resident_phone: string;
  service_id: number;
  time_slot_id: number;
  appointment_date: string;
  status_id: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

// =====================
// API SERVICE
// =====================
class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log('API Request:', url, options); // Debugging
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...options.headers,
        },
      });

      const responseText = await response.text();
      console.log('API Response:', response.status, responseText); // Debugging

      if (!response.ok) {
        let errorData: any = { message: `HTTP ${response.status}` };
        try {
          errorData = JSON.parse(responseText);
        } catch {
          errorData = { message: responseText || `HTTP ${response.status}` };
        }
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}`);
      }

      // Parse JSON if response is not empty
      if (responseText.trim() === '') {
        return {} as T;
      }
      
      return JSON.parse(responseText);
    } catch (error: any) {
      console.error('API Request Failed:', error);
      throw error;
    }
  }

  // ===== HEALTH & DIAGNOSTIC =====
  healthCheck(): Promise<HealthCheckResponse> {
    return this.request('/health-check');
  }

  checkProviders(): Promise<any> {
    return this.request('/check-providers');
  }

  testDb(): Promise<any> {
    return this.request('/test-db');
  }

  // ===== SIMPLE TESTS =====
  testSimple(): Promise<{ status: string; message: string }> {
    return this.request('/test-simple');
  }

  testJson(): Promise<{ message: string }> {
    return this.request('/test-json');
  }

  // ===== PUBLIC APPOINTMENT ENDPOINTS =====
  getPublicServices(): Promise<Service[]> {
    return this.request('/public/services');
  }

  getAvailableTimeSlots(): Promise<TimeSlot[]> {
    return this.request('/public/time-slots/available');
  }

  createPublicAppointment(data: PublicAppointmentRequest): Promise<PublicAppointmentResponse> {
    // Convert string IDs to numbers if needed
    const formattedData = {
      ...data,
      service_id: typeof data.service_id === 'string' ? parseInt(data.service_id) : data.service_id,
      time_slot_id: typeof data.time_slot_id === 'string' ? parseInt(data.time_slot_id) : data.time_slot_id,
    };
    
    return this.request('/public/appointments', {
      method: 'POST',
      body: JSON.stringify(formattedData),
    });
  }

  getAppointmentByReference(referenceNo: string): Promise<PublicAppointmentResponse> {
    return this.request(`/public/appointments/${referenceNo}`);
  }

  // ===== ADMIN APPOINTMENT ENDPOINTS =====
  getAllAppointments(): Promise<Appointment[]> {
    return this.request('/appointments');
  }

  getAppointment(id: number): Promise<Appointment> {
    return this.request(`/appointments/${id}`);
  }

  updateAppointmentStatus(id: number, statusId: number): Promise<Appointment> {
    return this.request(`/appointments/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status_id: statusId }),
    });
  }

  deleteAppointment(id: number): Promise<any> {
    return this.request(`/appointments/${id}`, {
      method: 'DELETE',
    });
  }

  // ===== SERVICE MANAGEMENT =====
  getAllServices(): Promise<Service[]> {
    return this.request('/services');
  }

  getService(id: number): Promise<Service> {
    return this.request(`/services/${id}`);
  }

  // ===== USER MANAGEMENT =====
  getAllUsers(): Promise<User[]> {
    return this.request('/users');
  }

  getUser(id: number): Promise<User> {
    return this.request(`/users/${id}`);
  }

  // ===== TIME SLOT MANAGEMENT =====
  getAllTimeSlots(): Promise<TimeSlot[]> {
    return this.request('/time-slots');
  }

  getTimeSlot(id: number): Promise<TimeSlot> {
    return this.request(`/time-slots/${id}`);
  }

  // ===== REPORTS =====
  generateAppointmentReport(data: any): Promise<any> {
    return this.request('/reports/generate-appointment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  generateServiceDemandReport(): Promise<any> {
    return this.request('/reports/generate-service-demand');
  }

  // ===== STATISTICS =====
  getDashboardStats(): Promise<{
    total_appointments: number;
    pending_appointments: number;
    completed_appointments: number;
    total_users: number;
    available_services: number;
    today_appointments: number;
  }> {
    // You might need to create this endpoint in Laravel
    // For now, we'll calculate from existing data
    return Promise.all([
      this.getAllAppointments(),
      this.getAllUsers(),
      this.getAllServices()
    ]).then(([appointments, users, services]) => {
      const today = new Date().toISOString().split('T')[0];
      
      return {
        total_appointments: appointments.length,
        pending_appointments: appointments.filter(a => a.status_id === 1).length,
        completed_appointments: appointments.filter(a => a.status_id === 3).length,
        total_users: users.length,
        available_services: services.filter(s => s.is_active).length,
        today_appointments: appointments.filter(a => 
          a.appointment_date.startsWith(today)
        ).length,
      };
    });
  }

  // ===== UTILITY METHODS =====
  async testAllEndpoints(): Promise<Record<string, boolean>> {
    const endpoints = [
      '/health-check',
      '/test-simple',
      '/public/services',
      '/public/time-slots/available',
      '/appointments',
      '/services',
      '/users',
    ];
    
    const results: Record<string, boolean> = {};
    
    for (const endpoint of endpoints) {
      try {
        await this.request(endpoint);
        results[endpoint] = true;
      } catch {
        results[endpoint] = false;
      }
    }
    
    return results;
  }
}

export const api = new ApiService();
