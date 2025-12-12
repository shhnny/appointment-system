import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="h-screen flex bg-white overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Left side - Welcome message */}
        <div className="hidden lg:flex lg:flex-1 min-h-0">
          <div className="relative w-full">
            <div className="absolute inset-0 bg-primary rounded-r-[7rem] opacity-20 blur-3xl" />
            <div className="relative h-full w-full bg-gradient-to-br from-primary to-primary/80 rounded-r-[7rem] flex flex-col justify-center items-center p-8 text-white">
              <div className="max-w-md text-center">
                <h1 className="text-4xl font-bold mb-6 leading-tight">
                  Welcome Back!
                </h1>
                <p className="text-lg text-white/90">
                  Access essential barangay services, updates, and records securely.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Role selection */}
        <div className="flex flex-col items-center justify-center flex-1 min-h-0 p-6">
          {/* Logo and title */}
          <div className="mb-12 text-center">
            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              <div className="w-32 h-32 flex items-center justify-center"> {/* Bigger logo container */}
                <img
                  src="/assets/JP RIZAL.png"
                  alt="Barangay JP Rizal Logo"
                  className="w-30 h-34 object-contain" /* Bigger logo */
                />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-foreground"> <span className="text-primary">hapsayRizal</span></h2>
                <p className="text-muted-foreground mt-1 ">Appointment System</p>
              </div>
            </div>
          </div>


          <div className="w-full max-w-sm">
            <h3 className="text-xl font-bold text-center text-foreground mb-8">
              Select User Role
            </h3>

            <div className="space-y-4">
              {/* Resident button */}
              <Link
                to="/resident-dashboard"
                className="block w-full px-6 py-4 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 border border-border hover:border-primary/30 text-center"
              >
                Resident
              </Link>

              {/* Administrator button */}
              <Link
                to="/admin-login"
                className="block w-full px-6 py-4 bg-muted hover:bg-muted/80 text-foreground font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 border border-border hover:border-primary/30 text-center"
              >
                Administrator
              </Link>
            </div>

            {/* Footer message */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Please ensure you select the correct role to access your account securely.
            </p>
          </div>

          {/* Mobile-only welcome section */}
          <div className="mt-8 lg:hidden w-full max-w-sm">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white text-center">
              <h1 className="text-3xl font-bold mb-3">Welcome Back!</h1>
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
