import NoChatSelected from "../components/NoChatSelected.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useChatStore } from "../stores/useChatStore.js";
import ChatContainer from "../components/ChatContainer.jsx";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useEffect } from "react";
import { axiosInstance } from "../lib/axios.js";
import { getDeviceInfo } from "../lib/utils.js";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const { authUser } = useAuthStore();
  const { selectedUser } = useChatStore();
  const navigate = useNavigate();

  useEffect(() => {
    const localSecretKey = localStorage.getItem(`${authUser.email}_secret_key`);

    if (!localSecretKey) {
      navigate("/setSecretKey");
    }
  }, [authUser.email, navigate]);

  return (
    <div className="flex-1 min-h-0 flex justify-center pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="glass-panel w-full max-w-6xl h-full flex overflow-hidden">
        <Sidebar />
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </div>
  );
};

export default HomePage;
