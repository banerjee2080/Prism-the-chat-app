import { useChatStore } from "../stores/useChatStore.js";
import { useAuthStore } from "../stores/useAuthStore.js";
import { X, Trash2, UserPlus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, deleteContact, contacts, getContacts, getSidebarUsers } = useChatStore();
  const { onlineUsers, addContact } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);

  const navigate = useNavigate();
  
  const isContact = contacts.some((c) => c._id === selectedUser._id);

  const handleDelete = () => {
    setSelectedUser(null);
    deleteContact(selectedUser._id);
    navigate("/");
  };

  const handleAdd = async () => {
    setIsAdding(true);
    await addContact(selectedUser);
    await getContacts();
    await getSidebarUsers();
    setIsAdding(false);
  };

  return (
    <div className="p-4 border-b border-base-content/10 flex justify-between items-center backdrop-blur-md bg-base-100/40 sticky top-0 z-10 shadow-sm shadow-base-content/5">
      <div className="flex items-center gap-3">
        <div className="relative">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="size-10 object-cover rounded-full shadow-sm shadow-base-content/10"
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
      <div className="flex items-center gap-2">
        {isContact ? (
          <button
            onClick={handleDelete}
            className="btn btn-error btn-sm opacity-80 hover:opacity-100 text-white flex items-center gap-2"
            title="Delete Contact"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Delete</span>
          </button>
        ) : (
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="btn btn-primary btn-sm opacity-80 hover:opacity-100 text-white flex items-center gap-2"
            title="Add Contact"
          >
            {isAdding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
            <span className="hidden sm:inline">Add</span>
          </button>
        )}
        <button
          onClick={() => setSelectedUser(null)}
          className="btn btn-ghost btn-sm btn-circle opacity-70 hover:opacity-100"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
