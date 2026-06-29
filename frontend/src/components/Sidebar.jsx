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
    <aside>
      <input
        type="checkbox"
        checked={showOnlineOnly}
        onChange={(e) => {
          setShowOnlineOnly(e.target.checked);
        }}
      />
      <span>Show Online Only</span>
      <div>
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>

            {/* User info - only visible on larger screens */}
            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}
      </div>
    </aside>
  );
}

export default Sidebar