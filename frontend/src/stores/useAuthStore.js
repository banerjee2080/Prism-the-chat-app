import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { generateKeyPair } from "../lib/crypto.js";
import { getDeviceInfo } from "../lib/utils.js";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  socket: null,
  onlineUsers: [],
  devices: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth: ", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  getDevices: async () => {
    try {
      const res = await axiosInstance.get("/auth/device");
      set({ devices: res.data });
    } catch (error) {
      console.log("Error in getDevices: ", error);
    }
  },

  logout: async () => {
    try {
      await axiosInstance.get("/auth/logout");
      set({ authUser: null });
      get().disConnectSocket();
      toast.success("Logout Successful");
    } catch (error) {
      console.log("Error in logout: ", error);
      toast.error(error.response?.data?.message || error.message);
    }
  },

  login: async (formData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", formData);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Logged in Successfully");
    } catch (error) {
      console.log("Error in login: ", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  signup: async (formData) => {
    set({ isSigningUp: true });
    try {
      const { publicKey, secretKey } = generateKeyPair();
      localStorage.setItem(`${formData.email}_secret_key`, secretKey);

      const deviceInfo = getDeviceInfo();

      const payload = { ...formData, publicKey, devices: [deviceInfo] };
      const res = await axiosInstance.post("/auth/signup", payload);
      set({ authUser: res.data });
      get().connectSocket();
      toast.success("Signed up successfully.");
    } catch (error) {
      console.log("Error in signup: ", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/updateProfile", data);
      set({ authUser: res.data });
      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    import("./useChatStore.js").then(({ useChatStore }) => {
      useChatStore.getState().initGlobalListeners();
    });
  },

  disConnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  addContact: async (contact) => {
    try {
      const res = await axiosInstance.post("/auth/addContact", { contact });
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },

  removeDevice: async (deviceId) => {
    try {
      const res = await axiosInstance.delete(`/auth/device/${deviceId}`);

      const currentDeviceId = localStorage.getItem("deviceId");
      if (currentDeviceId === deviceId) {
        const currentUserEmail = get().authUser.email;
        localStorage.removeItem(`${currentUserEmail}_secret_key`);
        localStorage.removeItem("deviceId");
        get().logout();
      } else {
        toast.success("Device removed successfully");
      }

      set({ devices: res.data.devices });
      return res.data.devices;
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  },
}));
