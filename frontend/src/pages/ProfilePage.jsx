import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import {
  Camera,
  Mail,
  User,
  Loader2,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <div className="flex-1 overflow-y-auto pt-20 pb-10 flex items-center justify-center p-4">
      {/* Glassmorphic Container */}
      <div className="w-full max-w-2xl glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-2xl shadow-base-content/5">
        {/* Subtle background glow effect */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10">
          <button
            onClick={() => navigate("/")}
            className="btn btn-sm btn-ghost mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </button>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-base-content mb-2">
              Profile
            </h1>
            <p className="text-base-content/60 text-sm">
              Manage your personal information
            </p>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center mb-10">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-base-100 shadow-xl shadow-base-content/10 relative z-10 transition-transform duration-300 group-hover:scale-[1.02]">
                <img
                  src={authUser.profilePic || selectedImage || "/avatar.png"}
                  alt="Profile picture"
                  className="w-full h-full object-cover"
                />

                {/* Upload Overlay */}
                <label
                  htmlFor="avatar-upload"
                  className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer backdrop-blur-sm ${isUpdatingProfile ? "pointer-events-none" : ""}`}
                >
                  {isUpdatingProfile ? (
                    <Loader2 className="size-8 text-white animate-spin" />
                  ) : (
                    <Camera className="size-8 text-white" />
                  )}
                </label>
              </div>

              <input
                type="file"
                id="avatar-upload"
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUpdatingProfile}
              />
            </div>
            <p className="mt-4 text-sm text-base-content/60 font-medium">
              {isUpdatingProfile ? "Uploading..." : "Click image to update"}
            </p>
          </div>

          {/* Profile Details section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold mb-4 text-base-content/80">
              Account Details
            </h2>

            <div className="bg-base-100/50 backdrop-blur-md rounded-3xl p-4 border border-base-content/10 flex items-center gap-4 transition-all duration-300 hover:bg-base-100/70">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <User className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-base-content/50 uppercase font-semibold tracking-wider">
                  Full Name
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {authUser.fullName}
                </p>
              </div>
            </div>

            <div className="bg-base-100/50 backdrop-blur-md rounded-3xl p-4 border border-base-content/10 flex items-center gap-4 transition-all duration-300 hover:bg-base-100/70">
              <div className="w-10 h-10 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary">
                <Mail className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-base-content/50 uppercase font-semibold tracking-wider">
                  Email
                </p>
                <p className="text-sm font-medium mt-0.5">{authUser.email}</p>
              </div>
            </div>

            <div className="bg-base-100/50 backdrop-blur-md rounded-3xl p-4 border border-base-content/10 flex items-center gap-4 transition-all duration-300 hover:bg-base-100/70">
              <div className="w-10 h-10 rounded-2xl bg-accent/10 flex items-center justify-center text-accent">
                <Calendar className="size-5" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-base-content/50 uppercase font-semibold tracking-wider">
                  Member Since
                </p>
                <p className="text-sm font-medium mt-0.5">
                  {authUser.createdAt?.split("T")[0] || "Unknown"}
                </p>
              </div>
              <div className="badge badge-success badge-sm shadow-sm shadow-base-content/10">
                Active
              </div>
            </div>

            <button
              onClick={() => navigate("/secretKey")}
              className="w-full mt-6 bg-primary/10 hover:bg-primary/20 backdrop-blur-md rounded-3xl p-4 border border-primary/20 flex items-center justify-center gap-2 transition-all duration-300 text-primary font-semibold shadow-lg shadow-primary/5 group"
            >
              <span>View Secret Key</span>
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                <ArrowLeft className="size-3 rotate-180" />
              </div>
            </button>
            <button
              onClick={() => navigate("/devices")}
              className="w-full mt-6 bg-primary/10 hover:bg-primary/20 backdrop-blur-md rounded-3xl p-4 border border-primary/20 flex items-center justify-center gap-2 transition-all duration-300 text-primary font-semibold shadow-lg shadow-primary/5 group"
            >
              <span>View Devices</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
