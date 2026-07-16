import React, { useEffect, useState } from "react";
import { useChatStore } from "../stores/useChatStore.js";
import { useNavigate } from "react-router-dom";
import { Search, UserPlus, X, CheckCircle2, Loader2 } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore.js";
import toast from "react-hot-toast";

const AddContacts = () => {
  const { getUsers, users, isUsersLoading, contacts, getContacts } =
    useChatStore();
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

  if (isUsersLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-300/60 backdrop-blur-sm">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-300/60 backdrop-blur-sm">
      <div className="glass w-full max-w-md bg-base-100/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 p-2 bg-base-200/50 hover:bg-base-300/50 rounded-full transition-colors z-10"
        >
          <X className="size-5" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8 mt-4">
            <h2 className="text-2xl font-bold text-base-content mb-2">
              Add New Contact
            </h2>
            <p className="text-sm text-base-content/60">
              Search for users by name or email
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-6 relative">
            <input
              type="text"
              placeholder="Enter name or email..."
              className="input input-bordered w-full pl-12 bg-base-200/50 focus:bg-base-100/50 transition-colors border-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/50 size-5" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-sm btn-ghost btn-circle"
            >
              <Search className="size-4" />
            </button>
          </form>

          {searched && (
            <div className="mt-4 transition-all duration-300">
              {contact ? (
                <div className="flex items-center justify-between p-4 bg-base-200/30 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <img
                      src={contact.profilePic || "/avatar.png"}
                      alt={contact.fullName}
                      className="size-12 object-cover rounded-full shadow-sm"
                    />
                    <div>
                      <p className="font-semibold text-base-content">
                        {contact.fullName}
                      </p>
                      <p className="text-xs text-base-content/60">
                        {contact.email}
                      </p>
                    </div>
                  </div>

                  {isAlreadyContact ? (
                    <div className="flex flex-col items-center text-success">
                      <CheckCircle2 className="size-6 mb-1" />
                      <span className="text-[10px] uppercase font-bold">
                        Added
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={async () => {
                        setIsAdding(true);
                        await addContact(contact);
                        await getContacts();
                        setIsAdding(false);
                      }}
                      disabled={isAdding}
                      className="btn btn-primary btn-sm rounded-xl shadow-lg shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {isAdding ? (
                        <Loader2 className="size-4 mr-1 animate-spin" />
                      ) : (
                        <UserPlus className="size-4 mr-1" />
                      )}
                      {isAdding ? "Adding..." : "Add"}
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-center p-6 bg-base-200/30 rounded-2xl border border-white/5">
                  <p className="text-base-content/70 text-sm">No user found.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddContacts;
