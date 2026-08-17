import { useChatStore } from "../stores/useChatStore.js";
import { useAuthStore } from "../stores/useAuthStore.js";
import { X, Trash2, UserPlus, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ChatHeader = () => {
  const {
    selectedUser,
    setSelectedUser,
    deleteContact,
    contacts,
    getContacts,
    getSidebarUsers,
  } = useChatStore();
  const { onlineUsers, addContact } = useAuthStore();
  const [isAdding, setIsAdding] = useState(false);

  const navigate = useNavigate();

  const isContact = contacts.some((c) => c._id === selectedUser._id);
  const isOnline = onlineUsers.includes(selectedUser._id);

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
    <div className="glass-bar sticky top-0 z-20 px-3 sm:px-5 py-3 flex items-center justify-between gap-3 border-x-0 border-t-0 rounded-none">
      <div className="flex items-center gap-3 min-w-0">
        {/* Back to list on mobile */}
        <button
          onClick={() => setSelectedUser(null)}
          className="lg:hidden glass-tile press size-9 rounded-xl grid place-items-center text-base-content/70 shrink-0"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="size-4.5" />
        </button>

        <div className="relative shrink-0">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="size-11 object-cover rounded-[1.1rem]"
          />
          {isOnline && (
            <span className="online-dot absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full" />
          )}
        </div>

        <div className="min-w-0">
          <h1 className="font-bold tracking-tight text-base-content/90 truncate">
            {selectedUser.fullName}
          </h1>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] mt-0.5 truncate">
            <span
              className={isOnline ? "text-success" : "text-base-content/40"}
            >
              {isOnline ? "Online" : "Offline"}
            </span>
            <span className="text-base-content/20">•</span>
            <span className="hidden sm:flex items-center gap-1 text-base-content/40">
              <ShieldCheck className="size-3" />
              Encrypted
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {isContact ? (
          <button
            onClick={handleDelete}
            className="glass-tile glass-hover press sheen h-9 px-3 rounded-xl flex items-center gap-2 text-error"
            title="Delete contact"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-[0.1em]">
              Delete
            </span>
          </button>
        ) : (
          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="glass-tile glass-hover press sheen h-9 px-3 rounded-xl flex items-center gap-2 text-primary disabled:opacity-60"
            title="Add contact"
          >
            {isAdding ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <UserPlus className="size-4" />
            )}
            <span className="hidden sm:inline text-xs font-bold uppercase tracking-[0.1em]">
              Add
            </span>
          </button>
        )}

        <button
          onClick={() => setSelectedUser(null)}
          className="hidden lg:grid glass-tile glass-hover press size-9 rounded-xl place-items-center text-base-content/60 hover:text-base-content"
          aria-label="Close conversation"
        >
          <X className="size-4.5" />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
