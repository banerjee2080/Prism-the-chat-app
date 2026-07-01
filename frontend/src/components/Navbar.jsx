import { Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore.js";
import { Settings, User, LogOut, MessageSquare } from "lucide-react";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  return (
    <nav className="glass-panel rounded-none border-t-0 border-x-0 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
        >
          <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <MessageSquare className="size-5 text-primary" />
          </div>
          Prism
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to={"/settings"}
            className="btn btn-ghost btn-sm rounded-full gap-2"
          >
            <Settings className="size-4" />
            <span className="hidden sm:inline">Settings</span>
          </Link>
          {authUser && (
            <>
              <Link
                to={"/profile"}
                className="btn btn-ghost btn-sm rounded-full gap-2"
              >
                <User className="size-4" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <button
                onClick={logout}
                className="btn btn-ghost btn-sm rounded-full gap-2 text-error hover:bg-error/20"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
