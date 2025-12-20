import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import Appointments from "./pages/Appointments";
import BookAppointment from "./pages/BookAppointment";
import ForgotPassword from "./pages/ForgotPassword";
import HelpCentre from "./pages/HelpCentre";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/Notifications";
import ResidentDashboard from "./pages/ResidentDashboard";
import Settings from "./pages/Settings";
import TimeSlots from "./pages/TimeSlots";
import CreateSlot from "./pages/CreateSlot";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/time-slots" element={<TimeSlots />} />
        <Route path="/admin/create-time-slot" element={<CreateSlot />} />
        <Route path="/admin/appointments" element={<Appointments />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/help-centre" element={<HelpCentre />} />
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
