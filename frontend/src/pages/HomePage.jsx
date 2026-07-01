import NoChatSelected from "../components/NoChatSelected.jsx";
import Sidebar from "../components/Sidebar.jsx";
import { useChatStore } from "../stores/useChatStore.js";
import ChatContainer from "../components/ChatContainer.jsx";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  return (
    <div className="flex-1 flex justify-center pt-8 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="glass-panel w-full max-w-6xl h-full flex overflow-hidden">
        <Sidebar />
        {selectedUser ? <ChatContainer /> : <NoChatSelected />}
      </div>
    </div>
  );
};

export default HomePage;
