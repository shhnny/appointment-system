import { Link } from "react-router-dom";

export default function ResidentDashboard() {
  return (
    <div className="h-screen flex bg-white overflow-hidden">
      {/* Back button - Upper left */}
      <div className="absolute top-6 left-6 z-10">
        <Link
          to="/"
          className="inline-flex items-center justify-center w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full text-white hover:bg-white/20 transition-all duration-200 shadow-md hover:shadow-lg"
          title="Home"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </Link>
      </div>

      {/* Help/Support Button - Upper right */}
      <div className="absolute top-6 right-6 z-10">
        <Link
          to="/help-centre"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors duration-200 font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-gray-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          Help & Support
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
                  Access essential barangay services, updates, and records
                  securely.
                </p>
                {/* Additional help info in the welcome section */}
                <div className="mt-8 pt-6">
                  <Link
                    to="/help-centre"
                    className="inline-flex items-center gap-2 text-white hover:text-white/90 text-sm font-medium underline underline-offset-2"
                  ></Link>
                </div>
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
                  src="/assets/Logo.png"
                  alt="Barangay Logo Logo"
                  className="w-32 h-32 object-contain"
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

          {/* Main CTA Buttons */}
          <div className="w-full max-w-sm space-y-4">
            {/* Schedule Appointment button */}
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
                Access essential barangay services, updates, and records
                securely.
              </p>
              {/* Help link in mobile section */}
              <div className="mt-4 pt-4">
                <Link
                  to="/help-centre"
                  className="inline-flex items-center gap-2 text-sm font-medium text-white hover:text-white/90"
                >
                  Need help? Contact Support
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
