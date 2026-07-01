import { useChatStore } from "../stores/useChatStore.js";
import { useAuthStore } from "../stores/useAuthStore.js";
import { X } from "lucide-react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();
  return (
    <div className="p-4 border-b border-base-content/10 flex justify-between items-center backdrop-blur-md bg-base-100/40 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="size-10 object-cover rounded-full shadow-sm"
          />
          {onlineUsers.includes(selectedUser._id) && (
            <span
              className="absolute bottom-0 right-0 size-2.5 bg-green-500 
                rounded-full ring-2 ring-base-100"
            />
          )}
        </div>
        <div>
          <h1 className="font-semibold">{selectedUser.fullName}</h1>
          <p className="text-xs text-base-content/60">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <button
        onClick={() => setSelectedUser(null)}
        className="btn btn-ghost btn-sm btn-circle opacity-70 hover:opacity-100"
      >
        <X className="size-5" />
      </button>
    </div>
  );
};

export default ChatHeader;
