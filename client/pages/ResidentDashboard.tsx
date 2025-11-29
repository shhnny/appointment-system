import { Link } from "react-router-dom";

export default function ResidentDashboard() {
  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Back button - Upper left */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-white hover:text-gray-200 transition-colors duration-200 font-medium"
        >
          ← Back to Home
        </Link>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Left side - Welcome message */}
        <div className="hidden lg:flex lg:flex-1 min-h-0">
          <div className="relative w-full">
            <div className="absolute inset-0 bg-primary rounded-r-[3rem] opacity-20 blur-3xl" />
            <div className="relative h-full w-full bg-gradient-to-br from-primary to-primary/80 rounded-r-[7rem] flex flex-col justify-center items-center p-8 text-white">
              <div className="max-w-md text-center">
                <h1 className="text-4xl font-bold mb-6 leading-tight">
                  Hello, Residents!
                </h1>
                <p className="text-lg text-white/90">
                  Access essential barangay services, updates, and records securely.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Appointment section */}
        <div className="flex flex-col items-center justify-center flex-1 min-h-0 p-6">
          {/* Logo and title */}
          <div className="mb-12 text-center">
            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              <div className="w-90 h-10 flex items-center justify-center">
                <img
                  src="/assets/JP RIZAL.png"
                  alt="Barangay JP Rizal Logo"
                  className="w-28 h-28 object-contain"
                />
              </div>

            </div>
          </div>

          {/* Welcome message and CTA */}
          <div className="w-full max-w-sm text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Welcome to <span className="text-primary">hapsayRizal</span>
            </h2>
            <p className="text-muted-foreground">
              Your hassle-free appointment system
            </p>
          </div>

          {/* Schedule Appointment button */}
          <div className="w-full max-w-sm">
            <Link
              to="/book-appointment"
              className="block w-full px-6 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 text-center"
            >
              Schedule Appointment
            </Link>
          </div>

          {/* Mobile-only welcome section */}
          <div className="mt-8 lg:hidden w-full max-w-sm">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-[2rem] p-6 text-white text-center">
              <h1 className="text-2xl font-bold mb-3">Hello, Residents!</h1>
              <p className="text-white/90 text-sm">
                Access essential barangay services, updates, and records securely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
