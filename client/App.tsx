import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Appointments from "./pages/Appointments";
import BookAppointment from "./pages/BookAppointment";
import HelpCentre from "./pages/HelpCentre";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import ResidentDashboard from "./pages/ResidentDashboard";
import Settings from "./pages/Settings";
import ResidentHelpCentre from "./pages/ResidentHelpCentre";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/reports" element={<Reports />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/help" element={<HelpCentre />} />
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route path="/resident-dashboard" element={<ResidentDashboard />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="*" element={<NotFound />} />

        <Route path="/resident-dashboard" element={<ResidentDashboard />} />
        <Route path="/book-appointment" element={<BookAppointment />} />

        {/* ADD THIS LINE RIGHT HERE: */}
        <Route path="/help-centre" element={<ResidentHelpCentre />} />

        <Route path="/admin-login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}

export default App;
