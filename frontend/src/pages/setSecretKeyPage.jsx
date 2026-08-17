import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../lib/axios.js";
import { getDeviceInfo } from "../lib/utils.js";
import { verifySecretKey } from "../lib/crypto.js";
import toast from "react-hot-toast";
import { KeyRound, ArrowRight, Loader2 } from "lucide-react";
import GlassModal from "../components/GlassModal.jsx";

const SetSecretKeyPage = () => {
  const [secretKey, setSecretKey] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { authUser, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!secretKey.trim()) {
      toast.error("Please enter a secret key.");
      return;
    }

    if (!verifySecretKey(secretKey, authUser.publicKey)) {
      toast.error("Invalid secret key. Please try again.");
      return;
    }

    setIsVerifying(true);
    localStorage.setItem(`${authUser.email}_secret_key`, secretKey);
    const deviceInfo = getDeviceInfo();

    try {
      await axiosInstance.post("/auth/device", deviceInfo);
      toast.success("Secret key set successfully!");
      navigate("/");
    } catch (error) {
      console.log("Error adding device:", error);
      toast.error(error.response?.data?.message || error.message);
      navigate("/");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <GlassModal
      onClose={logout}
      dismissible={false}
      icon={KeyRound}
      title="Unlock this device"
      subtitle="Your secret key decrypts your messages and registers this device."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="block">
          <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-base-content/50 mb-2 ml-1">
            Secret key
          </span>
          <div className="glass-field flex items-center h-12 px-5">
            <input
              type="text"
              autoFocus
              placeholder="Paste your key"
              className="flex-1 min-w-0 bg-transparent border-none outline-none text-base-content caret-primary font-mono text-sm placeholder:text-base-content/35 placeholder:font-sans"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={isVerifying}
          className="sheen press group w-full h-12 rounded-2xl bg-primary text-primary-content font-bold tracking-wide glow-primary flex items-center justify-center gap-2 transition-transform duration-400 hover:-translate-y-0.5 disabled:opacity-60"
        >
          {isVerifying ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="size-5 transition-transform duration-400 group-hover:translate-x-1" />
            </>
          )}
        </button>

        <button
          type="button"
          onClick={logout}
          className="w-full text-xs font-semibold uppercase tracking-[0.12em] text-base-content/40 hover:text-base-content/70 transition-colors"
        >
          Sign out instead
        </button>
      </form>
    </GlassModal>
  );
};

export default SetSecretKeyPage;
