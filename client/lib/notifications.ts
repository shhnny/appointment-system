export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const notificationStorage = {
  getNotifications: (): Notification[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("admin-notifications");
    if (!stored) return [];

    return JSON.parse(stored).map((n: any) => ({
      ...n,
      timestamp: new Date(n.timestamp),
    }));
  },

  saveNotifications: (notifications: Notification[]) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("admin-notifications", JSON.stringify(notifications));
  },

  markAsRead: (id: string) => {
    const notifications = notificationStorage.getNotifications();
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n,
    );
    notificationStorage.saveNotifications(updated);
  },

  markAllAsRead: () => {
    const notifications = notificationStorage.getNotifications();
    const updated = notifications.map((n) => ({ ...n, read: true }));
    notificationStorage.saveNotifications(updated);
  },

  addNotification: (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => {
    const notifications = notificationStorage.getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    const updated = [newNotification, ...notifications].slice(0, 50); // Keep last 50
    notificationStorage.saveNotifications(updated);
    return newNotification;
  },

  clearAll: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("admin-notifications");
  },
};
