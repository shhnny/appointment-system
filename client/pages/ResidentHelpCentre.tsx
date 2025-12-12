import { Link } from "react-router-dom";

export default function ResidentHelpCentre() {
  const contactSupport = () => {
    const subject = "Support Request - Barangay Appointment System";
    const body = `Hello Support Team,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nThank you.`;
    window.location.href = `mailto:hapsayrizal.support@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link
          to="/resident-dashboard"
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary transition-colors duration-200 font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Dashboard
        </Link>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-lg">
            ?
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Help & Support Centre
          </h1>
          <p className="text-lg text-gray-600">
            Get help with using the Barangay Appointment System
          </p>
        </div>

        {/* Contact Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Need Assistance?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              You can reach us through any of these channels
            </p>

            {/* Contact Methods */}
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {/* Email Card */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 hover:shadow-md transition-shadow duration-200">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                  📧
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-700 mb-4">
                  Send us an email and we'll respond as soon as possible
                </p>
                <p className="text-blue-600 font-semibold break-all">
                  hapsayrizal.support@gmail.com
                </p>
              </div>

              {/* Phone Card */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 hover:shadow-md transition-shadow duration-200">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                  ☎️
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Phone</h3>
                <p className="text-gray-700 mb-4">
                  Call us during office hours for immediate assistance
                </p>
                <p className="text-green-600 font-semibold">(085) 123-4567</p>
              </div>

              {/* Address Card */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 hover:shadow-md transition-shadow duration-200">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl mb-4 mx-auto">
                  📍
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Address
                </h3>
                <p className="text-gray-700 mb-4">
                  Visit us at our barangay office
                </p>
                <p className="text-purple-600 font-semibold">
                  Barangay Rizal Office, Butuan City
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={contactSupport}
                className="px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                Email Support
              </button>
              <button
                onClick={() => (window.location.href = "tel:+0851234567")}
                className="px-8 py-4 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center justify-center gap-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Call Now
              </button>
            </div>

            {/* Office Hours */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📅 Office Hours
              </h3>
              <p className="text-gray-700">
                Our support team is available during office hours:{" "}
                <span className="font-semibold text-gray-900">
                  Monday to Friday, 8:00 AM - 5:00 PM
                </span>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Responses outside office hours may take longer
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How do I schedule an appointment?
              </h3>
              <p className="text-gray-600">
                Go to your dashboard and click "Schedule Appointment". Select
                the service you need, choose a date and time, and submit your
                request.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What services are available?
              </h3>
              <p className="text-gray-600">
                We offer various services including barangay clearance, business
                permits, indigency certificates, and other documentation
                services.
              </p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                How long does it take to get a response?
              </h3>
              <p className="text-gray-600">
                During office hours, we typically respond within 1-2 hours. For
                emails sent outside office hours, expect a response by the next
                business day.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Barangay Information and Service Management System © 2025 - All
            Rights Reserved.
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Barangay JP Rizal, Butuan City
          </p>
        </div>
      </div>
    </div>
  );
}
