import { useAuthStore } from "../stores/useAuthStore.js";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell, AuthField, AuthButton } from "../components/AuthLayout.jsx";

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
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to pick up where you left off"
      footer={
        <>
          Don&apos;t have an account?{" "}
          <Link
            to="/signup"
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            Create one
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          icon={Mail}
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <AuthField
          icon={Lock}
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
          trailing={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="size-8 rounded-full grid place-items-center text-base-content/40 hover:text-base-content transition-colors press"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="size-4.5" />
              ) : (
                <Eye className="size-4.5" />
              )}
            </button>
          }
        />

        <AuthButton
          type="submit"
          loading={isLoggingIn}
          loadingLabel={
            <>
              <Loader2 className="size-5 animate-spin" />
              Signing in...
            </>
          }
        >
          Sign in
        </AuthButton>
      </form>
    </AuthShell>
  );
};

export default LoginPage;
