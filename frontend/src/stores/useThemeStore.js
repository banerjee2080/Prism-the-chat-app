import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
  notificationSound: localStorage.getItem("chat-sound") || "default",
  setNotificationSound: (notificationSound) => {
    localStorage.setItem("chat-sound", notificationSound);
    set({ notificationSound });
  },
  isMuted: localStorage.getItem("chat-muted") === "true",
  setIsMuted: (isMuted) => {
    localStorage.setItem("chat-muted", String(isMuted));
    set({ isMuted });
  },
}));