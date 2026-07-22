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
    <div className="flex-1 overflow-y-auto pt-10 pb-10 flex justify-center p-4 bg-base-200/50">
      {/* Glassmorphic Container */}
      <div className="w-full max-w-2xl bg-base-100/60 backdrop-blur-2xl p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden shadow-2xl shadow-base-content/5 border border-base-content/10 h-fit mt-4">
        {/* Subtle background glow effect */}
        <div className="absolute -top-10 -right-10 w-96 h-96 bg-primary/20 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-secondary/20 rounded-full blur-[80px] opacity-60 pointer-events-none"></div>

        <div className="relative z-10">
          <button
            onClick={() => navigate("/")}
            className="btn btn-sm btn-ghost mb-6 flex items-center gap-2 hover:bg-base-300/50 rounded-full px-4 transition-all"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </button>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-base-content to-base-content/60 mb-2">
              Profile
            </h1>
            <p className="text-base-content/60 text-sm font-medium">
              Manage your personal information
            </p>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative group cursor-pointer">
              <div className="w-36 h-36 rounded-[2.5rem] overflow-hidden border border-base-content/10 shadow-xl shadow-base-content/10 relative z-10 transition-transform duration-500 group-hover:scale-[1.05] group-hover:rotate-2 bg-base-200">
                <img
                  src={authUser.profilePic || selectedImage || "/avatar.png"}
                  alt="Profile picture"
                  className="w-full h-full object-cover transition-opacity duration-300 group-hover:opacity-80"
                />

                {/* Upload Overlay */}
                <label
                  htmlFor="avatar-upload"
                  className={`absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer backdrop-blur-sm ${isUpdatingProfile ? "pointer-events-none opacity-100 bg-black/50" : ""}`}
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
            <p className="mt-4 text-sm text-base-content/60 font-medium tracking-wide">
              {isUpdatingProfile ? "Uploading..." : "Click image to update"}
            </p>
          </div>

          {/* Profile Details section */}
          <div className="space-y-4 max-w-md mx-auto">
            <div className="bg-base-200/50 backdrop-blur-md rounded-[2rem] p-5 border border-base-content/5 flex items-center gap-5 transition-all duration-300 hover:bg-base-200/80 hover:shadow-md hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                <User className="size-6" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-base-content/50 uppercase font-bold tracking-widest">
                  Full Name
                </p>
                <p className="text-base font-semibold mt-0.5 text-base-content/90">
                  {authUser.fullName}
                </p>
              </div>
            </div>

            <div className="bg-base-200/50 backdrop-blur-md rounded-[2rem] p-5 border border-base-content/5 flex items-center gap-5 transition-all duration-300 hover:bg-base-200/80 hover:shadow-md hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary shadow-inner">
                <Mail className="size-6" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-base-content/50 uppercase font-bold tracking-widest">
                  Email
                </p>
                <p className="text-base font-semibold mt-0.5 text-base-content/90">{authUser.email}</p>
              </div>
            </div>

            <div className="bg-base-200/50 backdrop-blur-md rounded-[2rem] p-5 border border-base-content/5 flex items-center gap-5 transition-all duration-300 hover:bg-base-200/80 hover:shadow-md hover:scale-[1.02]">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-inner">
                <Calendar className="size-6" />
              </div>
              <div className="flex-1">
                <p className="text-[11px] text-base-content/50 uppercase font-bold tracking-widest">
                  Member Since
                </p>
                <p className="text-base font-semibold mt-0.5 text-base-content/90">
                  {authUser.createdAt?.split("T")[0] || "Unknown"}
                </p>
              </div>
              <div className="badge badge-success badge-sm shadow-sm font-semibold tracking-wide px-3 py-2.5">
                Active
              </div>
            </div>

            <div className="pt-6 space-y-3">
              <button
                onClick={() => navigate("/secretKey")}
                className="w-full bg-primary text-primary-content hover:bg-primary/90 rounded-[2rem] p-4 flex items-center justify-center gap-2 transition-all duration-300 font-semibold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-[1.02] group"
              >
                <span>View Secret Key</span>
                <div className="w-6 h-6 rounded-full bg-primary-content/20 flex items-center justify-center group-hover:bg-primary-content/30 transition-colors">
                  <ArrowLeft className="size-3 rotate-180" />
                </div>
              </button>
              <button
                onClick={() => navigate("/devices")}
                className="w-full bg-base-200/50 hover:bg-base-200/80 text-base-content rounded-[2rem] p-4 border border-base-content/10 flex items-center justify-center gap-2 transition-all duration-300 font-semibold shadow-sm hover:shadow-md hover:scale-[1.02]"
              >
                <span>View Devices</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
