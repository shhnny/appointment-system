import { Notification, notificationStorage } from "@/lib/notifications";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

interface AdminHeaderProps {
  currentDate?: string;
}

export default function AdminHeader({ currentDate }: AdminHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    setNotifications(notificationStorage.getNotifications());

    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      notificationStorage.markAsRead(notification.id);
      setNotifications(notificationStorage.getNotifications());
    }

    if (notification.action) {
      notification.action.onClick();
    }
    setShowNotifications(false);
  };

  const markAllAsRead = () => {
    notificationStorage.markAllAsRead();
    setNotifications(notificationStorage.getNotifications());
  };

  const clearAllNotifications = () => {
    notificationStorage.clearAll();
    setNotifications([]);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin-login");
    navigate("/admin-login");
  };

  const addSampleNotifications = () => {
    notificationStorage.addNotification({
      title: "New Appointment Request",
      message: "Juan Dela Cruz requested a Barangay Clearance appointment",
      type: "info",
      action: {
        label: "View",
        onClick: () => navigate("/admin/appointments"),
      },
    });

    notificationStorage.addNotification({
      title: "Appointment Confirmed",
      message: "Maria Santos confirmed her appointment for tomorrow",
      type: "success",
    });

    setNotifications(notificationStorage.getNotifications());
  };

  return (
    <header className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:border-primary pl-10"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/admin/help")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors relative"
            title="Help & Support"
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
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>

          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors relative"
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
                  d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-4.66-6.24M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-lg border border-border z-50">
                <div className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">
                      Notifications
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-primary hover:text-primary/80 font-semibold"
                      >
                        Mark all read
                      </button>
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs text-red-500 hover:text-red-600 font-semibold"
                      >
                        Clear all
                      </button>
                      <button
                        onClick={addSampleNotifications}
                        className="text-xs text-blue-500 hover:text-blue-600 font-semibold"
                        title="Add sample notifications"
                      >
                        Demo
                      </button>
                    </div>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground text-sm">
                      No notifications
                    </div>
                  ) : (
                    notifications.slice(0, 10).map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors ${!notification.read ? "bg-blue-50" : ""
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 ${notification.type === "success"
                              ? "bg-green-500"
                              : notification.type === "warning"
                                ? "bg-yellow-500"
                                : notification.type === "error"
                                  ? "bg-red-500"
                                  : "bg-blue-500"
                              }`}
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-muted-foreground text-sm mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {notification.timestamp.toLocaleDateString()} at{" "}
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                            {notification.action && (
                              <button className="text-xs text-primary font-semibold mt-2 hover:text-primary/80">
                                {notification.action.label}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-border text-center">
                    <button
                      onClick={() => navigate("/admin/notifications")}
                      className="text-sm text-primary hover:text-primary/80 font-semibold"
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-sm">
                YG
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold text-foreground">
                  Yul Francis G.
                </p>
                <p className="text-xs text-muted-foreground">Brgy. Secretary</p>
              </div>
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-border z-50">
                {/* Profile Info - Simplified */}
                <div className="p-4 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg">
                      YG
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Yul Francis G.</h3>
                      <p className="text-sm text-muted-foreground">Administrator</p>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-green-600 font-medium">Active • On Duty</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logout Only */}
                <div className="p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
