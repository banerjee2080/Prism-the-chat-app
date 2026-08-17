import { useEffect, useState } from "react";
import { useChatStore } from "../stores/useChatStore.js";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, CheckCircle2, Loader2, UserSearch } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore.js";
import GlassModal from "../components/GlassModal.jsx";

const AddContacts = () => {
  const {
    getUsers,
    users,
    isUsersLoading,
    contacts,
    getContacts,
    getSidebarUsers,
  } = useChatStore();
  const { addContact } = useAuthStore();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [search, setSearch] = useState("");
  const [searched, setSearched] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    getUsers();
    getContacts();
  }, [getUsers, getContacts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    const foundContact = users.find(
      (u) =>
        u.fullName.toLowerCase() === search.toLowerCase() ||
        u.email.toLowerCase() === search.toLowerCase(),
    );

    setContact(foundContact || null);
    setSearched(true);
  };

  const isAlreadyContact =
    contact && contacts?.some((c) => c._id === contact._id);

  const handleAdd = async () => {
    setIsAdding(true);
    await addContact(contact);
    await getContacts();
    await getSidebarUsers();
    setIsAdding(false);
  };

  if (isUsersLoading) {
    return (
      <div className="glass-backdrop fixed inset-0 z-[90] grid place-items-center p-4">
        <div className="brand-mark size-14 rounded-[1.4rem] grid place-items-center animate-float">
          <Loader2 className="size-7 text-primary-content animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <GlassModal
      onClose={() => navigate("/")}
      icon={UserSearch}
      title="Add a contact"
      subtitle="Search by exact name or email address"
    >
      <form onSubmit={handleSubmit} className="glass-field flex items-center h-12 pl-4 pr-1.5 gap-3">
        <Search className="size-4.5 shrink-0 text-base-content/40" />
        <input
          type="text"
          autoFocus
          placeholder="name or you@example.com"
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-base-content caret-primary text-[15px] placeholder:text-base-content/35"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          type="submit"
          className="press h-9 px-4 rounded-full bg-primary text-primary-content text-sm font-bold glow-primary transition-transform hover:scale-105"
        >
          Find
        </button>
      </form>

      {searched && (
        <div className="mt-5 animate-pop">
          {contact ? (
            <div className="glass-card flex items-center gap-4 p-4 rounded-[1.4rem]">
              <img
                src={contact.profilePic || "/avatar.png"}
                alt={contact.fullName}
                className="size-12 object-cover rounded-[1.1rem] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-base-content/90 truncate">
                  {contact.fullName}
                </p>
                <p className="text-xs text-base-content/50 truncate">
                  {contact.email}
                </p>
              </div>

              {isAlreadyContact ? (
                <span className="flex flex-col items-center gap-1 text-success shrink-0">
                  <CheckCircle2 className="size-6" />
                  <span className="text-[9px] font-bold uppercase tracking-[0.12em]">
                    Added
                  </span>
                </span>
              ) : (
                <button
                  onClick={handleAdd}
                  disabled={isAdding}
                  className="press sheen shrink-0 h-10 px-4 rounded-xl bg-primary text-primary-content text-sm font-bold glow-primary flex items-center gap-2 disabled:opacity-60"
                >
                  {isAdding ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <UserPlus className="size-4" />
                  )}
                  {isAdding ? "Adding" : "Add"}
                </button>
              )}
            </div>
          ) : (
            <div className="glass-card text-center p-6 rounded-[1.4rem]">
              <p className="text-sm font-semibold text-base-content/70">
                No user found
              </p>
              <p className="text-xs text-base-content/45 mt-1">
                Names and emails have to match exactly.
              </p>
            </div>
          )}
        </div>
      )}
    </GlassModal>
  );
};

export default AddContacts;
