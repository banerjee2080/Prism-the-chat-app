import { useAuthStore } from "../stores/useAuthStore.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPage = () => {
  const { login, isLoggingIn } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }
    login(formData);
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
              Welcome Back
            </h1>
            <p className="text-base-content/60 text-sm">
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
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
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
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
                  placeholder="Enter your password"
                  className="input w-full pl-12 pr-12 rounded-full bg-base-100/50 border-base-content/10 focus:bg-base-100 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
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
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="size-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-sm text-base-content/60">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-primary font-medium hover:underline transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
