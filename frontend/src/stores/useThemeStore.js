import { create } from "zustand";
import {
  DEFAULT_THEME,
  LEGACY_THEME_MAP,
  THEME_IDS,
} from "../constants/index.js";

const resolveTheme = (stored) => {
  if (THEME_IDS.includes(stored)) return stored;
  return LEGACY_THEME_MAP[stored] || DEFAULT_THEME;
};

const initialTheme = resolveTheme(localStorage.getItem("chat-theme"));
localStorage.setItem("chat-theme", initialTheme);

export const useThemeStore = create((set) => ({
  theme: initialTheme,
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
