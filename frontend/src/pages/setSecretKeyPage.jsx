import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";
import { getDeviceInfo } from "../lib/utils.js";
import toast from "react-hot-toast";
import { KeyRound, ArrowRight, X } from "lucide-react";

const SetSecretKeyPage = () => {
  const [secretKey, setSecretKey] = useState("");
  const { authUser } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      toast.error("Please enter a secret key.");
      return;
    }

    localStorage.setItem(`${authUser.email}_secret_key`, secretKey);
    const deviceInfo = getDeviceInfo();

    try {
      await axiosInstance.post("/auth/device", deviceInfo);
      toast.success("Secret key set successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error adding device:", error);
      toast.error(error.response?.data?.message || error.message);
      // Still navigate since key is set locally, or maybe not?
      // Let's navigate since the key is saved locally.
      navigate("/");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-300/60 backdrop-blur-sm">
      <div className="glass w-full max-w-md bg-base-100/50 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-2xl">
        {/* Subtle background glow effect */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10 text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 shadow-inner">
            <KeyRound className="size-8" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-base-content mb-2">
            Set Secret Key
          </h1>
          <p className="text-base-content/60 text-sm mb-8">
            This key is required to encrypt your messages and identify this
            device.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/80 ml-1">
                Your Secret Key
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter a secure key..."
                  className="w-full bg-base-100/50 border border-base-content/10 text-base-content rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all backdrop-blur-md"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary rounded-2xl py-3 h-auto text-base font-semibold shadow-lg shadow-primary/30 group border-none"
            >
              Continue
              <ArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SetSecretKeyPage;
