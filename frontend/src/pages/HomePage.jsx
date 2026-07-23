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

  useEffect(() => {
    const verifyDeviceStatus = async () => {
      try {
        const res = await axiosInstance.get("/auth/device");
        const activeDevices = res.data;
        const currentDeviceInfo = getDeviceInfo();

        const deviceStillValid = activeDevices.find(
          (device) => device.deviceId === currentDeviceInfo.deviceId,
        );

        if (!deviceStillValid) {
          localStorage.removeItem(`${authUser.email}_secret_key`);
          navigate("/setSecretKey");
        }
      } catch (error) {
        console.log("Error verifying device: ", error);
      }
    };

    verifyDeviceStatus();
  }, [authUser.email, navigate]);

  return (
    <div className="flex-1 min-h-0 flex justify-center sm:pt-8 sm:pb-12 sm:px-4 md:px-6 lg:px-8 bg-base-200/30">
      <div className="bg-base-100/60 backdrop-blur-2xl sm:border border-base-content/10 sm:shadow-2xl sm:shadow-base-content/5 w-full max-w-7xl h-full flex overflow-hidden sm:rounded-[2.5rem]">
        <Sidebar />
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </div>
  );
};

export default HomePage;
