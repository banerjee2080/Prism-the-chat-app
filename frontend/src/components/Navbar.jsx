import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore.js";
import { Settings, User, LogOut, MessageSquare } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  return (
    <nav className="bg-base-100/80 backdrop-blur-lg border-b border-base-content/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <div className="size-10 rounded-2xl bg-primary/20 flex items-center justify-center">
            <MessageSquare className="size-6 text-primary" />
          </div>
          Prism
        </Link>

        <div className="flex items-center gap-4">
          <div className="tooltip tooltip-bottom" data-tip="Settings">
            <Link
              to={"/settings"}
              className="btn btn-ghost btn-circle"
            >
              <Settings className="size-6" />
            </Link>
          </div>
          {authUser && (
            <>
              <div className="tooltip tooltip-bottom" data-tip="Profile">
                <Link
                  to={"/profile"}
                  className="btn btn-ghost btn-circle"
                >
                  <User className="size-6" />
                </Link>
              </div>
              <div className="tooltip tooltip-bottom" data-tip="Logout">
                <button
                  onClick={logout}
                  className="btn btn-ghost btn-circle text-error hover:bg-error/20"
                >
                  <LogOut className="size-6" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
