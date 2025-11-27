import { useState, useEffect } from "react";
import AdminSidebar from "@/components/AdminSidebar";
import AdminHeader from "@/components/AdminHeader";
import { notificationStorage, Notification } from "@/lib/notifications";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    setNotifications(notificationStorage.getNotifications());
  }, []);

  const displayedNotifications =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const markAsRead = (id: string) => {
    notificationStorage.markAsRead(id);
    setNotifications(notificationStorage.getNotifications());
  };

  const markAllAsRead = () => {
    notificationStorage.markAllAsRead();
    setNotifications(notificationStorage.getNotifications());
  };

  const clearAll = () => {
    notificationStorage.clearAll();
    setNotifications([]);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader />

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Notifications
                </h1>
                <p className="text-muted-foreground">
                  Manage your system notifications
                </p>
              </div>

              <div className="flex gap-3">
                <select
                  value={filter}
                  onChange={(e) =>
                    setFilter(e.target.value as "all" | "unread")
                  }
                  className="px-4 py-2 bg-white border border-border rounded-lg focus:outline-none focus:border-primary"
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread Only</option>
                </select>

                <button
                  onClick={markAllAsRead}
                  className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Mark All as Read
                </button>

                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-border">
              {displayedNotifications.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground text-lg mb-2">
                    No notifications
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {filter === "unread"
                      ? "You have no unread notifications"
                      : "You have no notifications"}
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {displayedNotifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-6 hover:bg-muted/50 transition-colors ${
                        !notification.read ? "bg-blue-50" : ""
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-3 h-3 rounded-full mt-2 ${
                              notification.type === "success"
                                ? "bg-green-500"
                                : notification.type === "warning"
                                  ? "bg-yellow-500"
                                  : notification.type === "error"
                                    ? "bg-red-500"
                                    : "bg-blue-500"
                            }`}
                          />

                          <div>
                            <h3 className="font-semibold text-foreground text-lg">
                              {notification.title}
                            </h3>
                            <p className="text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            <p className="text-sm text-muted-foreground mt-2">
                              {notification.timestamp.toLocaleDateString()} at{" "}
                              {notification.timestamp.toLocaleTimeString()}
                            </p>

                            {notification.action && (
                              <button
                                onClick={notification.action.onClick}
                                className="mt-3 text-primary hover:text-primary/80 font-semibold"
                              >
                                {notification.action.label}
                              </button>
                            )}
                          </div>
                        </div>

                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            Mark Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-xs text-muted-foreground py-4 border-t border-border">
              Barangay Information and Service Management System © 2025 - All
              Rights Reserved.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
