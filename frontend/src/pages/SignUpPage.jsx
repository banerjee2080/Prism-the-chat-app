import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthShell, AuthField, AuthButton } from "../components/AuthLayout.jsx";

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
    <AuthShell
      title="Create your account"
      subtitle="A minute to set up, encrypted from the first message"
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline underline-offset-4"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthField
          icon={User}
          label="Full name"
          type="text"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={(e) =>
            setFromData({ ...formData, fullName: e.target.value })
          }
        />

        <AuthField
          icon={Mail}
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={(e) => setFromData({ ...formData, email: e.target.value })}
        />

        <AuthField
          icon={Lock}
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="At least 6 characters"
          value={formData.password}
          onChange={(e) =>
            setFromData({ ...formData, password: e.target.value })
          }
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
          loading={isSigningUp}
          loadingLabel={
            <>
              <Loader2 className="size-5 animate-spin" />
              Creating account...
            </>
          }
        >
          Create account
        </AuthButton>
      </form>
    </AuthShell>
  );
};

export default SignUpPage;
