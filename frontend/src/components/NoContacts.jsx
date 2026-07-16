import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoContacts = () => {
  const navigate = useNavigate();
  return (
    <aside className="h-full border-r border-base-content/10 w-full lg:w-72 flex flex-col items-center justify-center p-6">
      <div className="glass flex flex-col items-center gap-4 p-6 rounded-3xl w-full bg-base-100/30 backdrop-blur-md border border-white/10 text-center shadow-lg">
        <div className="bg-primary/20 p-4 rounded-full">
          <UserPlus className="size-8 text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-base-content">No contacts</h2>
          <p className="text-base-content/60 text-xs">
            Add someone to start chatting!
          </p>
        </div>
        <button
          className="btn btn-primary w-full shadow-lg shadow-primary/30 rounded-xl mt-2 transition-transform hover:scale-[1.02]"
          onClick={() => navigate("/add-Contacts")}
        >
          Add Contacts
        </button>
      </div>
    </aside>
  );
};

export default NoContacts;
