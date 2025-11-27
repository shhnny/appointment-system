import { storage } from "@/lib/storage";
import { useState } from "react";
import { Link } from "react-router-dom";

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  purpose: string;
}

interface BookingConfirmation {
  date: string;
  time: string;
}

export default function BookAppointment() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    purpose: "",
  });
  const [bookingConfirmation, setBookingConfirmation] =
    useState<BookingConfirmation | null>(null);

  // Generate time slots from 7:00 AM to 5:00 PM in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 17; hour++) { // 7 AM to 5 PM
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 17 && minute > 0) break; // Stop at 5:00 PM

        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour;
        const timeString = `${displayHour}:${minute === 0 ? '00' : '30'} ${period}`;
        const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

        slots.push({ display: timeString, value });
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (formData.fullName && formData.email && formData.phone) {
        setStep(2);
      }
    } else if (step === 2) {
      if (formData.date && formData.time && formData.purpose) {
        setBookingConfirmation({
          date: formData.date,
          time: formData.time,
        });
        setStep(3);
      }
    }
  };

  const handleSubmit = () => {
    // Build appointment object with required fields (id, status) and save it
    const appointment = {
      id: `${Date.now().toString()}-${Math.random().toString(36).slice(2, 9)}`,
      status: "pending",
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      date: formData.date,
      time: formData.time,
      purpose: formData.purpose,
    };

    // Save the appointment
    storage.saveAppointment(appointment);

    // Reset the form and go back to step 1
    setStep(1);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      date: "",
      time: "",
      purpose: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
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
          {step !== 3 && (
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

          {/* Step 1: Personal Information */}
          {step === 1 && (
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
                    className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border border-transparent focus:outline-none focus:border-primary"
                  />
                </div>
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
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border border-transparent focus:outline-none focus:border-primary"
                  />
                </div>
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
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border border-transparent focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <button
                onClick={handleNext}
                className="w-full mt-6 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200"
              >
                Next
              </button>
            </div>
          )}

          {/* Step 2: Date and Time Selection */}
          {step === 2 && (
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
                    className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border border-transparent focus:outline-none focus:border-primary"
                  />
                </div>
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
                  <select
                    value={formData.time}
                    onChange={(e) => handleInputChange("time", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border border-transparent focus:outline-none focus:border-primary appearance-none"
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot.value} value={slot.value}>
                        {slot.display}
                      </option>
                    ))}
                  </select>
                </div>
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
                    value={formData.purpose}
                    onChange={(e) =>
                      handleInputChange("purpose", e.target.value)
                    }
                    className="w-full pl-10 pr-4 py-3 bg-muted rounded-lg border border-transparent focus:outline-none focus:border-primary appearance-none"
                  >
                    <option value="">Purpose of visit</option>
                    <option value="Barangay Clearance">Barangay Clearance</option>
                    <option value="Certificate of Indigency">Certificate of Indigency</option>
                    <option value="Business Permit">Business Permit</option>
                    <option value="Blotter / Mediation">Blotter / Mediation</option>
                  </select>
                </div>
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
                  className="flex-1 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && bookingConfirmation && (
            <div className="text-center py-8">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
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
                </div>
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-6">
                Fill the FORM below
              </h2>

              <div className="bg-muted rounded-lg p-6 mb-6 inline-block">
                <div className="flex items-center justify-center gap-6 text-center">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-primary"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M6 2a1 1 0 000 2h8a1 1 0 100-2H6zM4 5a2 2 0 012-2 1 1 0 000 2H2a1 1 0 00-1 1v10a1 1 0 001 1h16a1 1 0 001-1V6a1 1 0 00-1-1h-4a1 1 0 000-2 2 2 0 00-2-2H6a2 2 0 00-2 2z" />
                    </svg>
                    <span className="font-semibold text-foreground">
                      {bookingConfirmation.date}
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
                      {timeSlots.find(slot => slot.value === bookingConfirmation.time)?.display || bookingConfirmation.time}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-lg font-semibold text-foreground mb-2">
                Thank you!
              </p>
              <p className="text-muted-foreground mb-8">
                Your booking is complete. An email with the
                <br />
                details of your booking has been sent to you.
              </p>

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
