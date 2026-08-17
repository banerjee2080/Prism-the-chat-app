import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore.js";
import { useThemeStore } from "./stores/useThemeStore.js";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import AddContacts from "./pages/AddContacts.jsx";
import SetSecretKeyPage from "./pages/setSecretKeyPage.jsx";
import SecretKeyPage from "./pages/SecretKeyPage.jsx";
import Devices from "./pages/Devices.jsx";
import AmbientBackground from "./components/AmbientBackground.jsx";

function App() {
  const { isCheckingAuth, authUser, checkAuth } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);

    const updateFavicon = () => {
      setTimeout(() => {
        const root = document.documentElement;
        let primaryStr = getComputedStyle(root)
          .getPropertyValue("--color-primary")
          .trim();

        if (
          primaryStr &&
          !primaryStr.startsWith("#") &&
          !primaryStr.startsWith("oklch") &&
          !primaryStr.startsWith("rgb") &&
          !primaryStr.startsWith("hsl")
        ) {
          primaryStr = `oklch(${primaryStr})`;
        }

        const color = primaryStr || "#8b5cf6";

        const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>`;

        const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
        let link = document.getElementById("dynamic-favicon");
        if (!link) {
          link = document.createElement("link");
          link.id = "dynamic-favicon";
          link.rel = "icon";
          document.head.appendChild(link);
        }
        link.href = url;
      }, 50);
    };

    updateFavicon();
  }, [theme]);
  if (isCheckingAuth && !authUser) {
    return (
      <div className="app-shell h-screen flex items-center justify-center text-base-content">
        <AmbientBackground />
        <div className="relative z-10 flex flex-col items-center gap-5 animate-glass-rise">
          <div className="brand-mark size-16 rounded-[1.4rem] flex items-center justify-center animate-float">
            <Loader className="size-8 text-primary-content animate-spin" />
          </div>
          <p className="text-sm font-medium tracking-[0.2em] uppercase text-base-content/50">
            Prism
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="app-shell h-screen text-base-content overflow-hidden flex flex-col">
      <AmbientBackground />
      <Navbar />
      <main className="relative z-10 flex-1 min-h-0 flex flex-col">
        <Routes>
          <Route
            path="/"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route path="/settings" element={<SettingsPage />} />
          <Route
            path="/profile"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-Contacts"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/setSecretKey"
            element={authUser ? <HomePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/secretKey"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
          <Route
            path="/devices"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>

      {authUser && location.pathname === "/add-Contacts" && <AddContacts />}
      {authUser && location.pathname === "/setSecretKey" && (
        <SetSecretKeyPage />
      )}
      {authUser && location.pathname === "/secretKey" && <SecretKeyPage />}
      {authUser && location.pathname === "/devices" && <Devices />}

      <Toaster
        position="top-center"
        toastOptions={{
          className: "glass-card !text-base-content !rounded-2xl !px-4 !py-3",
          style: {
            background: "var(--glass-bg-strong)",
            boxShadow: "0 20px 45px -25px var(--glass-shadow)",
            fontSize: "0.875rem",
            fontWeight: 500,
          },
          success: { iconTheme: { primary: "var(--color-success)", secondary: "var(--color-base-100)" } },
          error: { iconTheme: { primary: "var(--color-error)", secondary: "var(--color-base-100)" } },
        }}
      />
    </div>
  );
}

export default App;
