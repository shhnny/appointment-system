import { Link } from "react-router-dom";

export default function HelpCentre() {
  const contactSupport = () => {
    const subject = "Support Request - Barangay Appointment System";
    const body = `Hello Support Team,\n\nI need assistance with:\n\n[Please describe your issue here]\n\nThank you.`;
    window.location.href = `mailto:hapsoyrizal.support@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 ">
      <div className=" px-10">
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
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <div className="p-6 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Help & Support Centre
            </h1>
            <p className="text-muted-foreground mb-6">
              Get help with using the Barangay Appointment System
            </p>

            {/* Contact Information */}
            <div className="max-w-4xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-8 border border-border">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                    ?
                  </div>

                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Need Assistance?
                  </h2>

                  <p className="text-lg text-muted-foreground mb-8">
                    You can reach us through:
                  </p>

                  <div className="space-y-4 text-left max-w-md mx-auto">
                    {/* Email */}
                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        📧
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Email</p>
                        <p className="text-muted-foreground">
                          hapsayrizal.support@gmail.com
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        ☎️
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Phone</p>
                        <p className="text-muted-foreground">(085) 123-4567</p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                        📍
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">Address</p>
                        <p className="text-muted-foreground">
                          Barangay Rizal Office, Butuan City
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={contactSupport}
                      className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Email Support
                    </button>
                    <button
                      onClick={() => (window.location.href = "tel:+0851234567")}
                      className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Call Now
                    </button>
                  </div>

                  <p className="text-sm text-muted-foreground mt-6">
                    Our support team is available during office hours: Monday to
                    Friday, 8:00 AM - 5:00 PM
                  </p>
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
