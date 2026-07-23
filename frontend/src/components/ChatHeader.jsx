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
    <div className="p-5 flex justify-between items-center backdrop-blur-xl bg-base-100/60 sticky top-0 z-10 border-b border-base-content/5 shadow-sm">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className="relative shrink-0">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="size-11 object-cover rounded-[1.2rem] shadow-sm shadow-base-content/10"
          />
          {onlineUsers.includes(selectedUser._id) && (
            <span
              className="absolute -bottom-1 -right-1 size-3.5 bg-emerald-500 
                rounded-full border-[2.5px] border-base-100 shadow-sm"
            />
          )}
        </div>
        <div className="min-w-0">
          <h1 className="font-bold tracking-wide text-base-content/90 truncate">{selectedUser.fullName}</h1>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50 mt-0.5 truncate">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {isContact ? (
          <button
            onClick={handleDelete}
            className="btn btn-error btn-sm bg-error/10 hover:bg-error/20 text-error border-none rounded-xl flex items-center gap-2 transition-all"
            title="Delete Contact"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline font-semibold tracking-wide">Delete</span>
          </button>
        ) : (
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="btn btn-primary btn-sm bg-primary/10 hover:bg-primary/20 text-primary border-none rounded-xl flex items-center gap-2 transition-all"
            title="Add Contact"
          >
            {isAdding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
            <span className="hidden sm:inline font-semibold tracking-wide">Add</span>
          </button>
        )}
        <button
          onClick={() => setSelectedUser(null)}
          className="btn btn-ghost btn-sm btn-circle hover:bg-base-200 text-base-content/60 hover:text-base-content ml-1 transition-colors"
        >
          <X className="size-5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
