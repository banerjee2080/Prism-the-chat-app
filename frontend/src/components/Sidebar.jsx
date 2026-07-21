import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useChatStore, useChatStore } from "../stores/useChatStore.js";
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

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const filteredUsers = showOnlineOnly
    ? sidebarUsers.filter((c) => onlineUsers.includes(c._id))
    : sidebarUsers;

  if (isSidebarUsersLoading) return <SideBarSkeleton />;
  if (sidebarUsers.length === 0) return <NoContacts />;
  return (
    <aside
      className={`h-full border-r border-base-content/10 flex flex-col transition-all duration-300 ${selectedUser ? "hidden lg:flex lg:w-72" : "w-full lg:w-72 flex"}`}
    >
      <div className="border-b border-base-content/10 w-full p-5">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm rounded-full checkbox-primary"
          />
          <span className="text-sm font-medium block">Show Online Only</span>
        </label>
      </div>

      <div className="w-full px-5 pb-2">
        <button
          onClick={() => navigate("/add-Contacts")}
          className="btn btn-primary w-full shadow-md shadow-primary/20 rounded-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2"
        >
          <UserPlus className="size-4" />
          Add contact
        </button>
      </div>

      <div className="overflow-y-auto w-full py-3 px-2 flex flex-col gap-2 flex-1">
        {filteredUsers.map((contacts) => (
          <button
            key={contacts._id}
            onClick={() => setSelectedUser(contacts)}
            className={`
              w-full p-3 flex items-center gap-3 rounded-3xl transition-all duration-300 ease-out
              ${
                selectedUser?._id === contacts._id
                  ? "glass-liquid text-primary-content"
                  : "hover:bg-base-200/40 hover:backdrop-blur-md border border-transparent"
              }
            `}
          >
            <div className="relative">
              <img
                src={contacts.profilePic || "/avatar.png"}
                alt={contacts.name}
                className="size-12 object-cover rounded-full shadow-sm shadow-base-content/10"
              />
              {onlineUsers.includes(contacts._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-base-100"
                />
              )}
            </div>

            {/* User info */}
            <div className="text-left min-w-0 block">
              <div
                className={`font-semibold truncate ${selectedUser?._id === contacts._id ? "text-base-content" : ""}`}
              >
                {contacts.fullName}
              </div>
              <div
                className={`text-xs ${selectedUser?._id === contacts._id ? "text-base-content/70" : "text-base-content/50"}`}
              >
                {onlineUsers.includes(contacts._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/50 py-4 text-sm font-medium">
            No online users
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
