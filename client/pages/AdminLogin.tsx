import { storage } from "@/lib/storage";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // TEST MODE: Accept any email and password
    const savedUser = storage.getLogin();

    if (!savedUser) {
      storage.saveLogin(email, password);
    }

    navigate("/admin-dashboard");
  };

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
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Forgot Password?
                  </a>
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
