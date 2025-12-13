import { storage } from "@/lib/storage";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));

    // TEST MODE: Accept any email and password
    const savedUser = storage.getLogin();

    if (!savedUser) {
      storage.saveLogin(email, password);
    }

    localStorage.setItem("admin-last-login", new Date().toISOString());

    setIsLoading(false);
    navigate("/admin-dashboard");
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-foreground">Logging in...</p>
          <p className="text-muted-foreground mt-1">Please wait</p>
        </div>
      </div>
    );
  }

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
            <div className="absolute inset-0 bg-primary rounded-r-[7rem] opacity-20 blur-3xl" />
            <div className="relative h-full w-full bg-gradient-to-br from-primary to-primary/80 rounded-r-[7rem] flex flex-col justify-center items-center p-8 text-white">
              <div className="max-w-md text-center">
                <h1 className="text-4xl font-bold mb-6 leading-tight">
                  Welcome Back!
                </h1>
                <p className="text-1xl text-white/90">
                  Access administrative tools and maintain smooth barangay
                  operations with transparency and accuracy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex flex-col items-center justify-center flex-1 min-h-0 p-6">
          {/* Logo and title */}
          <div className="mb-8 text-center">
            <div className="flex flex-col items-center justify-center gap-4 mb-6">
              <div className="w-32 h-32 flex items-center justify-center">
                <img
                  src="/assets/JP RIZAL.png"
                  alt="Barangay JP Rizal Logo"
                  className="w-28 h-28 object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Barangay JP Rizal
                </h2>
                <p className="text-muted-foreground mt-1">Appointment System</p>
              </div>
            </div>
          </div>

          {/* Test mode indicator */}
          <div className="w-full max-w-sm mb-6">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-2 rounded-lg text-sm text-center">
              <strong>TEST MODE:</strong> Any email and password will work
            </div>
          </div>

          {/* Login form */}
          <div className="w-full max-w-sm">
            <form onSubmit={handleLogin}>
              <div className="space-y-4">
                {/* Error message */}
                {error && (
                  <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Email input */}
                <input
                  type="email"
                  placeholder="safighj@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                />

                {/* Password input */}
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                />

                {/* Links */}
                <div className="flex items-center justify-between text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 inline-flex items-center gap-1"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 2 2 0 012 2 1 1 0 102 0 4 4 0 00-4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Forgot Password?
                  </Link>
                </div>

                {/* Login button */}
                <button
                  type="submit"
                  className="w-full px-6 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all duration-200 transform hover:scale-105 mt-6"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>

          {/* Mobile-only welcome section */}
          <div className="mt-8 lg:hidden w-full max-w-sm">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white text-center">
              <h1 className="text-2xl font-bold mb-3">Welcome Back!</h1>
              <p className="text-white/90 text-sm">
                Access administrative tools and maintain smooth barangay
                operations with transparency and accuracy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
