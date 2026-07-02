import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const SignUpPage = () => {
  const [formData, setFromData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { isSigningUp, signup } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email))
      return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success) {
      signup(formData);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto pt-20 pb-10 flex items-center justify-center p-4">
      {/* Glassmorphic Container */}
      <div className="w-full max-w-md glass-panel p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-2xl shadow-base-content/5">
        {/* Subtle background glow effect */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-secondary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-semibold tracking-tight text-base-content mb-2">
              Create Account
            </h1>
            <p className="text-base-content/60 text-sm">
              Join us to get started
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/80">
                  Full Name
                </span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-base-content/40">
                  <User className="size-5" />
                </div>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input w-full pl-12 rounded-full bg-base-100/50 border-base-content/10 focus:bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFromData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/80">
                  Email
                </span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-base-content/40">
                  <Mail className="size-5" />
                </div>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="input w-full pl-12 rounded-full bg-base-100/50 border-base-content/10 focus:bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  value={formData.email}
                  onChange={(e) =>
                    setFromData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-base-content/80">
                  Password
                </span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-base-content/40">
                  <Lock className="size-5" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="input w-full pl-12 pr-12 rounded-full bg-base-100/50 border-base-content/10 focus:bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  value={formData.password}
                  onChange={(e) =>
                    setFromData({ ...formData, password: e.target.value })
                  }
                />
                <button
                  type="button"
                  className="absolute right-4 text-base-content/40 hover:text-base-content/80 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="size-5" />
                  ) : (
                    <Eye className="size-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full rounded-full mt-8 shadow-lg shadow-base-content/10 hover:shadow-primary/30 transition-all duration-300 transform active:scale-[0.98]"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-base-content/60">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-primary font-medium hover:underline transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
