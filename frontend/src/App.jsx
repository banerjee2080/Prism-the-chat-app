import { Navigate, Route, Router } from "react-router-dom"
import { useAuthStore } from "./stores/useAuthStore";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";

function App() {
  const { isCheckingAuth, authUser, checkAuth } = useAuthStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);

  if(isCheckingAuth && !authUser){
    return(
      <div>
        <Loader/>
      </div>
    )
  }
  return (
    <div>
      <Navbar />
      <Router>
        <Route path="/" element={authUser?<HomePage />:<Navigate to="/login"/>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser?<ProfilePage />:<Navigate to="/login"/>} />
      </Router>

      <Toaster/>
    </div>
  );
}

export default App
