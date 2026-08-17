import { useEffect, useMemo, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useChatStore } from "../stores/useChatStore.js";
import SideBarSkeleton from "./skeletons/SideBarSkeleton.jsx";
import NoContacts from "./NoContacts.jsx";
import { useNavigate } from "react-router-dom";
import { UserPlus, Search, X, Users } from "lucide-react";

const Sidebar = () => {
  const {
    setSelectedUser,
    selectedUser,
    isSidebarUsersLoading,
    getSidebarUsers,
    sidebarUsers,
    getContacts,
    unreadCounts,
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    getSidebarUsers();
    getContacts();
  }, [getSidebarUsers, getContacts]);

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [query, setQuery] = useState("");

  const onlineCount = sidebarUsers.filter((u) =>
    onlineUsers.includes(u._id),
  ).length;

  const filteredUsers = useMemo(() => {
    const term = query.trim().toLowerCase();
    return sidebarUsers.filter((user) => {
      if (showOnlineOnly && !onlineUsers.includes(user._id)) return false;
      if (!term) return true;
      return user.fullName?.toLowerCase().includes(term);
    });
  }, [sidebarUsers, showOnlineOnly, onlineUsers, query]);

  if (isSidebarUsersLoading) return <SideBarSkeleton />;
  if (sidebarUsers.length === 0) return <NoContacts />;

  return (
    <aside
      className={`h-full min-h-0 flex-col border-base-content/5 transition-all duration-500 ${
        selectedUser
          ? "hidden lg:flex lg:w-[23rem] lg:border-r"
          : "w-full lg:w-[23rem] flex lg:border-r"
      }`}
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-4 space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-base-content/90">
              Messages
            </h2>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-base-content/40 mt-1">
              {onlineCount > 0 ? `${onlineCount} online` : "No one online"}
            </p>
          </div>
          <button
            onClick={() => navigate("/add-Contacts")}
            className="glass-tile glass-hover press sheen size-11 rounded-2xl grid place-items-center text-primary"
            title="Add contact"
            aria-label="Add contact"
          >
            <UserPlus className="size-5" />
          </button>
        </div>

        {/* Search */}
        <div className="glass-field flex items-center gap-2 h-11 px-4">
          <Search className="size-4 shrink-0 text-base-content/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search contacts"
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-base-content caret-primary text-sm placeholder:text-base-content/40"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-base-content/40 hover:text-base-content transition-colors animate-pop"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Online filter */}
        <label className="glass-tile glass-hover flex items-center justify-between gap-3 h-11 px-4 rounded-2xl cursor-pointer">
          <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-base-content/70">
            <Users className="size-4" />
            Online only
          </span>
          <input
            type="checkbox"
            checked={showOnlineOnly}
            onChange={(e) => setShowOnlineOnly(e.target.checked)}
            className="toggle toggle-sm toggle-primary"
          />
        </label>
      </div>

      <div className="mx-5 h-px bg-gradient-to-r from-transparent via-base-content/10 to-transparent" />

      {/* Contact list */}
      <div className="scroll-area flex-1 min-h-0 overflow-y-auto px-3 py-3 flex flex-col gap-1.5">
        {filteredUsers.map((contact, index) => {
          const isActive = selectedUser?._id === contact._id;
          const isOnline = onlineUsers.includes(contact._id);
          const unread = unreadCounts[contact._id] || 0;

          return (
            <button
              key={contact._id}
              onClick={() => setSelectedUser(contact)}
              style={{ "--i": index }}
              className={`stagger animate-slide-in-left group relative w-full p-3 flex items-center gap-3.5 rounded-2xl border text-left press transition-all duration-400 ${
                isActive
                  ? "border-primary/30 bg-primary/12 shadow-[0_14px_30px_-22px_var(--glass-shadow)]"
                  : "border-transparent hover:border-base-content/10 hover:bg-base-content/5"
              }`}
            >
              {/* Active rail */}
              <span
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-full bg-primary transition-all duration-400 ${
                  isActive ? "h-8 opacity-100" : "h-0 opacity-0"
                }`}
              />

              <div className="relative shrink-0">
                <img
                  src={contact.profilePic || "/avatar.png"}
                  alt={contact.fullName}
                  className={`size-12 object-cover rounded-[1.1rem] transition-transform duration-500 group-hover:scale-105 ${
                    isActive
                      ? "ring-2 ring-primary/40 ring-offset-2 ring-offset-transparent"
                      : ""
                  }`}
                />
                {isOnline && (
                  <span className="online-dot absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={`truncate font-semibold text-[15px] ${
                    isActive ? "text-primary" : "text-base-content/90"
                  }`}
                >
                  {contact.fullName}
                </div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.12em] mt-0.5 text-base-content/40">
                  {isOnline ? "Online" : "Offline"}
                </div>
              </div>

              {unread > 0 && (
                <span className="animate-pop shrink-0 min-w-6 h-6 px-2 rounded-full bg-primary text-primary-content text-[11px] font-bold grid place-items-center glow-primary">
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="animate-fade-in text-center py-12 px-6">
            <div className="glass-tile size-14 rounded-2xl grid place-items-center mx-auto mb-4 text-base-content/40">
              <Search className="size-6" />
            </div>
            <p className="text-sm font-semibold text-base-content/60">
              No contacts found
            </p>
            <p className="text-xs text-base-content/40 mt-1">
              {query ? "Try a different name" : "Turn off the online filter"}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
