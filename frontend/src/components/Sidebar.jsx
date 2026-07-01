import { useEffect, useState } from "react";
import useAuthStore from "../stores/useAuthStore.js"
import { useChatStore } from "../stores/useChatStore.js";
import SideBarSkeleton from "./skeletons/SideBarSkeleton.jsx"

const Sidebar = () => {
  const {users, getUsers, isUsersLoading, setSelectedUser, selectedUser} = useChatStore();
  const {onlineUsers} = useAuthStore();

  useEffect(()=>{
    getUsers();
  },[getUsers]);

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const filteredUsers = showOnlineOnly?users.filter((user)=>(onlineUsers.includes(user._id))):users;

  if(isUsersLoading)return <SideBarSkeleton/>;
  return (
    <aside className="h-full w-20 lg:w-72 border-r border-base-content/10 flex flex-col transition-all duration-300">
      <div className="border-b border-base-content/10 w-full p-5">
        <label className="cursor-pointer flex items-center gap-2">
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="checkbox checkbox-sm rounded-full checkbox-primary"
          />
          <span className="text-sm font-medium hidden lg:block">Show Online Only</span>
        </label>
      </div>
      
      <div className="overflow-y-auto w-full py-3 px-2 flex flex-col gap-2">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3 rounded-2xl transition-all duration-300 ease-out
              ${selectedUser?._id === user._id 
                ? "glass-liquid text-primary-content" 
                : "hover:bg-base-200/40 hover:backdrop-blur-md border border-transparent"}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full shadow-sm"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-base-100"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className={`font-semibold truncate ${selectedUser?._id === user._id ? "text-base-content" : ""}`}>{user.fullName}</div>
              <div className={`text-xs ${selectedUser?._id === user._id ? "text-base-content/70" : "text-base-content/50"}`}>
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/50 py-4 text-sm font-medium">No online users</div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar