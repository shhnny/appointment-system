import { storage } from "./storage";

// Check if user is logged in as admin
export const isAdminLoggedIn = (): boolean => {
  return !!storage.getLogin();
};

// Logout the admin user
export const logout = () => {
  localStorage.removeItem("adminUser");
};

// Get current logged in admin
export const getCurrentAdmin = () => {
  return storage.getLogin();
};
