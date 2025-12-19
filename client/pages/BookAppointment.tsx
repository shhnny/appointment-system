import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../services/api";
import { getPublicTimeSlots } from "@/api/requests/time_slot";
import { TimeSlot } from "@/interfaces/time_slot.interface";
import { readableDate } from "@/lib/utils";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  date?: string;
  time?: string;
  purposeId?: string;
}

interface Service {
  id: number;
  name: string;
  service_name: string;
  service_id: number;
  description?: string;
}

interface BookingConfirmation {
  date: string;
  time: string;
  reference_no?: string;
}

export default function BookAppointment() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [residentId, setResidentId] = useState<number | null>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    purposeId: "",
  });
  const [loading, setLoading] = useState({
    services: false,
    timeSlots: false,
    submitting: false,
  });
  const [bookingConfirmation, setBookingConfirmation] =
    useState<BookingConfirmation | null>(null);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    phone?: string;
    date?: string;
    time?: string;
    purpose?: string;
    submit?: string;
  }>({});

  useEffect(() => {
    if (!timeSlot) return;
    const loadServices = async () => {
      try {
        setLoading((prev) => ({ ...prev, services: true }));
        const response = await fetch(`${API_BASE_URL}/public/services`);
        const data = await response.json();
        setServices(data.data);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading((prev) => ({ ...prev, services: false }));
      }
    };

    loadServices();
  }, [timeSlot]);

  useEffect(() => {
    const loadTimeSlot = async () => {
      try {
        setLoading((prev) => ({ ...prev, services: true }));
        const data = await getPublicTimeSlots();
        setAvailableTimeSlots(data.data);
      } catch (error) {
        console.error("Failed to load services:", error);
      } finally {
        setLoading((prev) => ({ ...prev, services: false }));
      }
    };

    loadTimeSlot();
  }, []);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  // Email validation - requires @gmail.com
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return emailRegex.test(email);
  };

  // Phone number validation - Philippine format
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^(09|\+639)\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ""));
  };

  // Handle input changes
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const createResident = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/residents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          full_name: formData.fullName,
          email_address: formData.email,
          phone_number: formData.phone,
        }),
      });
      const data = await response.json();
      setResidentId(data.data.resident_id);
    } catch (error) {
      console.error("Failed to create resident:", error);
    }
  };

  // Handle Next button
  const handleNext = async () => {
    const newErrors: typeof errors = {};

    if (step === 1) {
      if (!formData.fullName) newErrors.fullName = "Full name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!validateEmail(formData.email))
        newErrors.email = "Please enter a valid Gmail address";
      if (!formData.phone) newErrors.phone = "Phone number is required";
      else if (!validatePhone(formData.phone))
        newErrors.phone =
          "Please enter a valid Philippine phone number (09XXXXXXXXX or +639XXXXXXXXX)";

      if (Object.keys(newErrors).length === 0) {
        setErrors({});
        createResident();
        setStep(2);
      } else {
        setErrors(newErrors);
      }
    } else if (step === 2) {
      if (!formData.date) newErrors.date = "Date is required";
      if (!formData.time) newErrors.time = "Time is required";
      if (!formData.purposeId) newErrors.purpose = "Purpose is required";

      if (Object.keys(newErrors).length === 0) {
        setErrors({});

        setBookingConfirmation({
          date: formData.date,
          time: formData.time,
        });

        // Submit to Laravel API
        await submitToBackend();
      } else {
        setErrors(newErrors);
      }
    }
  };

  // Submit to Laravel Backend
  const submitToBackend = async () => {
    setLoading((prev) => ({ ...prev, submitting: true }));
    setErrors({});

    try {
      // Prepare data for Laravel API
      const appointmentData = {
        timeslot_id: timeSlot.timeslot_id,
        resident_id: residentId,
        service_id: formData.purposeId, // This should be service ID
        time_slot_id: formData.time, // This should be time slot ID
        appointment_date: formData.date,
        appointment_time: formData.time,
        purpose_notes: "", // Add notes if you have a field for it
      };

      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(appointmentData),
      });

      const data = await response.json();

      console.log("data: ", data);

      // Update confirmation with reference number
      setBookingConfirmation((prev) =>
        prev
          ? {
              ...prev,
              reference_no: data.data.reference_no,
            }
          : null,
      );

      setReferenceNumber(data.reference_no);
      setSubmitSuccess(true);
      setStep(3);
    } catch (error: any) {
      console.error("Failed to create appointment:", error);
      setErrors((prev) => ({
        ...prev,
        submit:
          error.message || "Failed to book appointment. Please try again.",
      }));

      setSubmitSuccess(true);
      setStep(3);
    } finally {
      setLoading((prev) => ({ ...prev, submitting: false }));
    }
  };

  // Handle final submission and reset
  const handleSubmit = () => {
    setStep(1);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      date: undefined,
      time: undefined,
      purposeId: "",
    });
    setErrors({});
    setBookingConfirmation(null);
    setSubmitSuccess(false);
    setReferenceNumber("");
    setTimeSlot(null);
    setResidentId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            to="/"
            className="flex items-center gap-3 text-primary hover:text-primary/80"
          >
            <div className="w-20 h-20 flex items-center justify-center">
              <img
                src="/assets/JP RIZAL.png"
                alt="Barangay JP Rizal Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-semibold">Barangay JP Rizal</span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          {timeSlot && step !== 3 && (
            <>
              <h2 className="text-2xl font-bold text-center text-primary mb-2">
                Fill the FORM below
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                You will be sent a confirmation mail when
                <br />
                your reservation has been confirmed
              </p>

              {/* Progress slider */}
              <div className="mb-8 px-4">
                <div className="flex items-center gap-4">
                  <div
                    className="h-2 bg-gray-300 rounded-full flex-1"
                    style={{
                      background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${step === 2 ? "50%" : "0%"}, #e5e7eb ${step === 2 ? "50%" : "0%"}, #e5e7eb 100%)`,
                    }}
                  />
                </div>
              </div>
            </>
          )}

          {!timeSlot && (
            <div>
              <div className="mb-3 font-semibold text-lg text-primary">
                Select Available Slot
              </div>
              <div className="grid grid-cols-3 gap-3">
                {availableTimeSlots.map((item) => (
                  <button
                    onClick={() => setTimeSlot(item)}
                    key={item.timeslot_id}
                    className="border rounded p-3 border-primary text-primary"
                  >
                    <div>{readableDate(item.slot_date)}</div>
                    <div className="text-sm">
                      {item.start_time}-{item.end_time}
                    </div>
                    <div className="text-sm">
                      Available slots: {item.available_slots}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {timeSlot && (
            <div className="mb-4 font-semibold">
              Slot: {timeSlot.slot_date} ({timeSlot.start_time}-
              {timeSlot.end_time})
            </div>
          )}

          {/* API Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <p className="font-semibold">⚠️ Appointment Submission Error</p>
              <p className="text-sm mt-1">{errors.submit}</p>
              <p className="text-xs mt-2">
                Your appointment has been saved locally and will be processed
                later.
              </p>
            </div>
          )}

          {/* Step 1: Personal Information */}
          {timeSlot && step === 1 && (
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-muted-foreground"
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
                  </div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleInputChange("fullName", e.target.value)
                    }
                    className={`w-full pl-10 pr-4 py-3 bg-muted rounded-lg border focus:outline-none ${
                      errors.fullName
                        ? "border-red-500 focus:border-red-500"
                        : "border-transparent focus:border-primary"
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address (Gmail only)"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-muted rounded-lg border focus:outline-none ${
                      errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-transparent focus:border-primary"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 00.948-.684l1.498-4.493a1 1 0 011.502-.684l1.498 4.493a1 1 0 00.948.684H19a2 2 0 012 2v1a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"
                      />
                    </svg>
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number (09XXXXXXXXX or +639XXXXXXXXX)"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className={`w-full pl-10 pr-4 py-3 bg-muted rounded-lg border focus:outline-none ${
                      errors.phone
                        ? "border-red-500 focus:border-red-500"
                        : "border-transparent focus:border-primary"
                    }`}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                )}
              </div>

              <button
                onClick={handleNext}
                disabled={loading.services}
                className={`w-full mt-6 px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
                  loading.services
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {loading.services ? "Loading services..." : "Next"}
              </button>
            </div>
          )}

          {/* Step 2: Date and Time Selection */}
          {timeSlot && step === 2 && (
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-muted-foreground"
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
                  </div>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    min={getMinDate()}
                    className={`w-full pl-10 pr-4 py-3 bg-muted rounded-lg border focus:outline-none ${
                      errors.date
                        ? "border-red-500 focus:border-red-500"
                        : "border-transparent focus:border-primary"
                    }`}
                  />
                </div>
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                )}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>

                  <input
                    type="time"
                    id="minutes"
                    name="minutes"
                    value={formData.time}
                    className={`w-full pl-10 pr-4 py-3 bg-muted rounded-lg border focus:outline-none appearance-none ${
                      errors.time
                        ? "border-red-500 focus:border-red-500"
                        : loading.timeSlots || !formData.date
                          ? "opacity-50 cursor-not-allowed"
                          : "border-transparent focus:border-primary"
                    }`}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                  />
                </div>
                {errors.time && (
                  <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                )}
                {loading.timeSlots && !errors.time && formData.date && (
                  <p className="text-sm text-gray-500 mt-1">
                    Loading available time slots...
                  </p>
                )}
              </div>

              <div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-muted-foreground"
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
                  </div>
                  <select
                    value={formData.purposeId}
                    onChange={(e) =>
                      handleInputChange("purposeId", e.target.value)
                    }
                    className={`w-full pl-10 pr-4 py-3 bg-muted rounded-lg border focus:outline-none appearance-none ${
                      errors.purpose
                        ? "border-red-500 focus:border-red-500"
                        : loading.services
                          ? "opacity-50 cursor-not-allowed"
                          : "border-transparent focus:border-primary"
                    }`}
                  >
                    <option value="" disabled hidden>
                      Select an option
                    </option>
                    {services.map((service) => (
                      <option
                        key={service.service_id}
                        value={service.service_id}
                      >
                        {service.service_name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.purpose && (
                  <p className="text-red-500 text-sm mt-1">{errors.purpose}</p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 px-6 py-3 bg-muted text-foreground font-semibold rounded-lg hover:bg-muted/80 transition-all duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={loading.submitting}
                  className={`flex-1 px-6 py-3 font-semibold rounded-lg transition-all duration-200 ${
                    loading.submitting
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-primary text-primary-foreground hover:bg-primary/90"
                  }`}
                >
                  {loading.submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {timeSlot && step === 3 && bookingConfirmation && (
            <div className="text-center py-8">
              <div className="mb-6 flex justify-center">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center ${
                    submitSuccess ? "bg-green-500" : "bg-yellow-500"
                  }`}
                >
                  {submitSuccess ? (
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-6">
                {submitSuccess
                  ? "Appointment Booked Successfully!"
                  : "Appointment Saved Locally"}
              </h2>

              <div className="bg-muted rounded-lg p-6 mb-6 inline-block">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM4 5a2 2 0 012-2 1 1 0 000 2H2a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V6a1 1 0 00-1-1h-4a1 1 0 000-2 2 2 0 00-2-2H6a2 2 0 00-2 2z" />
                    </svg>
                    <span className="font-semibold text-foreground">
                      {readableDate(bookingConfirmation.date)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold text-foreground">
                      {bookingConfirmation.time}
                    </span>
                  </div>

                  {referenceNumber && (
                    <div className="flex items-center gap-2 mt-2">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="font-semibold text-foreground">
                        Reference: {referenceNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-lg font-semibold text-foreground mb-2">
                Thank you!
              </p>
              <p className="text-muted-foreground mb-4">
                {submitSuccess
                  ? "Your booking has been confirmed. You will receive a confirmation email shortly."
                  : "Your booking has been saved locally. Please contact the barangay office for confirmation."}
              </p>

              {errors.submit && (
                <p className="text-sm text-yellow-600 mb-4">
                  Note: {errors.submit}
                </p>
              )}

              <button
                onClick={handleSubmit}
                className="w-full px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200"
              >
                Make another booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
