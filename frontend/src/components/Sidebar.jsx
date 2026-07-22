import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useChatStore } from "../stores/useChatStore.js";
import SideBarSkeleton from "./skeletons/SideBarSkeleton.jsx";
import NoContacts from "./NoContacts.jsx";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

const Sidebar = () => {
  const {
    setSelectedUser,
    selectedUser,
    isSidebarUsersLoading,
    getSidebarUsers,
    sidebarUsers,
    getContacts,
  } = useChatStore();
  const { onlineUsers, addContact } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getSidebarUsers();
    getContacts();
  }, [getSidebarUsers, getContacts]);

  const socket = useAuthStore((state) => state.socket);

  useEffect(() => {
    if (!socket) return;
    
    const handleNewMessage = () => {
      getSidebarUsers();
    };

    socket.on("newMessage", handleNewMessage);
    
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, getSidebarUsers]);

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const filteredUsers = showOnlineOnly
    ? sidebarUsers.filter((c) => onlineUsers.includes(c._id))
    : sidebarUsers;

  if (isSidebarUsersLoading) return <SideBarSkeleton />;
  if (sidebarUsers.length === 0) return <NoContacts />;
  return (
    <aside
      className={`h-full border-r border-base-content/5 flex flex-col transition-all duration-300 bg-base-100/30 ${selectedUser ? "hidden lg:flex lg:w-[22rem]" : "w-full lg:w-[22rem] flex"}`}
    >
      <div className="border-b border-base-content/5 w-full p-6">
        <label className="cursor-pointer flex items-center justify-between gap-3 bg-base-200/40 p-3 px-4 rounded-[1.5rem] border border-base-content/5 transition-all hover:bg-base-200/60">
          <span className="text-[13px] font-semibold text-base-content/80 tracking-wide uppercase">Show Online Only</span>
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="toggle toggle-sm toggle-primary"
          />
        </label>
      </div>

      <div className="w-full px-6 pb-2 pt-5">
        <button
          onClick={() => navigate("/add-Contacts")}
          className="btn btn-primary w-full shadow-lg shadow-primary/20 rounded-[1.5rem] transition-all duration-300 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 flex items-center justify-center gap-2 h-12 border-none"
        >
          <UserPlus className="size-5" />
          <span className="font-bold tracking-wide">Add Contact</span>
        </button>
      </div>

      <div className="overflow-y-auto w-full py-4 px-4 flex flex-col gap-2 flex-1">
        {filteredUsers.map((contacts) => (
          <button
            key={contacts._id}
            onClick={() => setSelectedUser(contacts)}
            className={`
              w-full p-3.5 flex items-center gap-4 rounded-[1.5rem] transition-all duration-300 ease-out group border border-transparent
              ${
                selectedUser?._id === contacts._id
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/20 scale-[1.02]"
                  : "hover:bg-base-200/50 hover:border-base-content/5 hover:scale-[1.01]"
              }
            `}
          >
            <div className="relative">
              <img
                src={contacts.profilePic || "/avatar.png"}
                alt={contacts.name}
                className={`size-12 object-cover rounded-2xl shadow-sm transition-transform duration-300 group-hover:scale-105 ${selectedUser?._id === contacts._id ? "shadow-primary/30" : "shadow-base-content/10"}`}
              />
              {onlineUsers.includes(contacts._id) && (
                <span
                  className="absolute -bottom-1 -right-1 size-3.5 bg-emerald-500 rounded-full border-[2.5px] border-base-100 shadow-sm"
                />
              )}
            </div>

            {/* User info */}
            <div className="text-left min-w-0 block">
              <div
                className={`font-bold truncate tracking-wide text-[15px] ${selectedUser?._id === contacts._id ? "text-primary-content" : "text-base-content/90"}`}
              >
                {contacts.fullName}
              </div>
              <div
                className={`text-[11px] font-semibold mt-1 tracking-wider uppercase ${selectedUser?._id === contacts._id ? "text-primary-content/80" : "text-base-content/40"}`}
              >
                {onlineUsers.includes(contacts._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/40 py-8 text-sm font-semibold tracking-wide">
            No contacts found
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
