import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore.js";
import { Settings, User, LogOut, MessageSquare } from "lucide-react";

const NavAction = ({ to, onClick, label, children, tone = "default" }) => {
  const base =
    "relative grid place-items-center size-10 rounded-2xl glass-tile glass-hover press sheen transition-colors";
  const tones = {
    default: "text-base-content/70 hover:text-base-content",
    active: "text-primary",
    danger: "text-error/80 hover:text-error",
  };
  const className = `${base} ${tones[tone]}`;

  const inner = (
    <>
      {children}
      <span className="sr-only">{label}</span>
    </>
  );

  return (
    <div className="tooltip tooltip-bottom" data-tip={label}>
      {to ? (
        <Link to={to} className={className} aria-label={label}>
          {inner}
        </Link>
      ) : (
        <button onClick={onClick} className={className} aria-label={label}>
          {inner}
        </button>
      )}
    </div>
  );
};

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const { pathname } = useLocation();

  return (
    <nav className="relative z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className="glass-bar mx-auto max-w-7xl h-14 sm:h-16 rounded-[1.6rem] px-3 sm:px-5 flex items-center justify-between animate-glass-rise">
        <Link
          to="/"
          className="group flex items-center gap-3 press"
          aria-label="Prism home"
        >
          <span className="brand-mark size-9 sm:size-10 rounded-[1.1rem] grid place-items-center transition-transform duration-500 group-hover:rotate-[8deg] group-hover:scale-105">
            <MessageSquare className="size-5 text-primary-content" />
          </span>
          <span className="text-lg sm:text-xl font-bold tracking-tight text-gradient">
            Prism
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <NavAction
            to="/settings"
            label="Settings"
            tone={pathname === "/settings" ? "active" : "default"}
          >
            <Settings className="size-5" />
          </NavAction>

          {authUser && (
            <>
              <NavAction
                to="/profile"
                label="Profile"
                tone={pathname.startsWith("/profile") ? "active" : "default"}
              >
                <User className="size-5" />
              </NavAction>
              <NavAction onClick={logout} label="Log out" tone="danger">
                <LogOut className="size-5" />
              </NavAction>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
