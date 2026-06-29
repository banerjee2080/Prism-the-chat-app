import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],

  checkAuth: async() => {
    try{  
      const res = await axiosInstance.get("/auth/check");
      set({authUser:res.data});
    }
    catch(error){
      console.log("Error in checkAuth: ",error);
      set({authUser:null});
    }
    finally{
      set({isCheckingAuth:false});
    }
  },

  logout: async() => {
    try{
      await axiosInstance.get("/auth/logout");
      set({authUser:null});
      toast.success("Logout Successful");
    }
    catch(error){
      console.log("Error in logout: ",error);
      toast.error("Error in logging out: ",error.response.data.message);
    }
  },

  login: async (formData) => {
    set({isLoggingIn:true});
    try{
      const res = await axiosInstance.post("/auth/login",formData);
      set({authUser:res.data});
      toast.success("Logged in Successfully");
    }
    catch(error){
      console.log("Error in login: ",error);
      toast.error("Error in login: ",error.response.data.message);
    }
    finally{
      set({isLoggingIn:false});
    }
  },

  signup: async (formData) => {
    set({isSigningUp:true});
    try{
      const res = await axiosInstance.post("/auth/signup",formData);
      set({authUser:res.data});
      toast.success("Signed up successfully.")
    }
    catch(error){
      console.log("Error in signup: ",error);
      toast.error("Error in signup: ",error.response.data.message);
    }
    finally{
      set({isSigningUp:false});
    }
  }
}));