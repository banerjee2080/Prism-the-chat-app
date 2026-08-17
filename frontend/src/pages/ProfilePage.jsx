import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import {
  Camera,
  Mail,
  User,
  Loader2,
  Calendar,
  ArrowLeft,
  ArrowRight,
  KeyRound,
  MonitorSmartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const InfoRow = ({ icon: Icon, tint, label, value, badge, index }) => (
  <div
    style={{ "--i": index }}
    className="stagger animate-glass-rise glass-card glass-hover flex items-center gap-4 p-4 rounded-[1.4rem]"
  >
    <div
      className={`size-11 rounded-[1.1rem] grid place-items-center shrink-0 ${tint}`}
    >
      <Icon className="size-5" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-base-content/40">
        {label}
      </p>
      <p className="text-[15px] font-semibold text-base-content/90 truncate mt-0.5">
        {value}
      </p>
    </div>
    {badge}
  </div>
);

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Img = reader.result;
      setSelectedImage(base64Img);
      await updateProfile({ profilePic: base64Img });
    };
  };

  return (
    <div className="flex-1 overflow-y-auto scroll-area flex justify-center py-6 px-4">
      <div className="glass-panel animate-glass-rise w-full max-w-2xl h-fit p-6 sm:p-10 rounded-[2rem]">
        <div className="relative z-10">
          <button
            onClick={() => navigate("/")}
            className="glass-tile glass-hover press inline-flex items-center gap-2 h-10 px-4 rounded-2xl text-sm font-semibold text-base-content/70 mb-8"
          >
            <ArrowLeft className="size-4" />
            Back to chats
          </button>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-10">
            <label
              htmlFor="avatar-upload"
              className="relative group cursor-pointer"
            >
              <div className="absolute inset-0 rounded-[2rem] bg-primary/30 blur-2xl scale-105 opacity-70" />
              <div className="relative size-32 rounded-[2rem] overflow-hidden border border-base-content/10 shadow-[0_24px_50px_-24px_var(--glass-shadow)] transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
                <img
                  src={selectedImage || authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
                <div
                  className={`absolute inset-0 grid place-items-center bg-black/45 backdrop-blur-sm transition-opacity duration-300 ${
                    isUpdatingProfile
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {isUpdatingProfile ? (
                    <Loader2 className="size-7 text-white animate-spin" />
                  ) : (
                    <Camera className="size-7 text-white" />
                  )}
                </div>
              </div>
            </label>

            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isUpdatingProfile}
            />

            <h1 className="text-2xl font-bold tracking-tight text-gradient mt-5">
              {authUser.fullName}
            </h1>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-base-content/40 mt-1.5">
              {isUpdatingProfile ? "Uploading..." : "Tap photo to change"}
            </p>
          </div>

          {/* Details */}
          <div className="space-y-3">
            <InfoRow
              index={0}
              icon={User}
              tint="bg-primary/15 text-primary"
              label="Full name"
              value={authUser.fullName}
            />
            <InfoRow
              index={1}
              icon={Mail}
              tint="bg-secondary/15 text-secondary"
              label="Email"
              value={authUser.email}
            />
            <InfoRow
              index={2}
              icon={Calendar}
              tint="bg-accent/15 text-accent"
              label="Member since"
              value={authUser.createdAt?.split("T")[0] || "Unknown"}
              badge={
                <span className="shrink-0 px-3 py-1 rounded-full bg-success/15 text-success text-[10px] font-bold uppercase tracking-[0.12em]">
                  Active
                </span>
              }
            />
          </div>

          {/* Actions */}
          <div className="grid sm:grid-cols-2 gap-3 mt-8">
            <button
              onClick={() => navigate("/secretKey")}
              className="sheen press group h-14 px-5 rounded-2xl bg-primary text-primary-content font-bold glow-primary flex items-center justify-between gap-3 transition-transform duration-400 hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2.5">
                <KeyRound className="size-5" />
                Secret key
              </span>
              <ArrowRight className="size-4 transition-transform duration-400 group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => navigate("/devices")}
              className="glass-tile glass-hover press sheen group h-14 px-5 rounded-2xl font-bold text-base-content/85 flex items-center justify-between gap-3"
            >
              <span className="flex items-center gap-2.5">
                <MonitorSmartphone className="size-5 text-base-content/60" />
                Devices
              </span>
              <ArrowRight className="size-4 transition-transform duration-400 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
