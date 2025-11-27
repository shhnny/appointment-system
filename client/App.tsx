import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Appointments from "./pages/Appointments";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import HelpCentre from "./pages/HelpCentre";
import Notifications from "./pages/Notifications";
import ResidentDashboard from "./pages/ResidentDashboard";
import BookAppointment from "./pages/BookAppointment";
import NotFound from "./pages/NotFound";

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
      </Routes>
    </Router>
  );
}

export default App;
