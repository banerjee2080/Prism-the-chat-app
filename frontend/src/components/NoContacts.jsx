import { UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NoContacts = () => {
  const navigate = useNavigate();

  return (
    <aside className="h-full w-full lg:w-[23rem] lg:border-r border-base-content/5 flex flex-col items-center justify-center p-6">
      <div className="glass-card animate-glass-rise w-full max-w-xs p-8 rounded-[1.75rem] flex flex-col items-center text-center gap-5">
        <div className="relative">
          <div className="absolute inset-0 rounded-[1.4rem] bg-primary/30 blur-xl scale-110" />
          <div className="brand-mark relative size-16 rounded-[1.4rem] grid place-items-center animate-float">
            <UserPlus className="size-7 text-primary-content" />
          </div>
        </div>

        <div className="space-y-1.5">
          <h2 className="text-lg font-bold tracking-tight text-base-content/90">
            No contacts yet
          </h2>
          <p className="text-sm text-base-content/50 leading-relaxed">
            Find someone by name or email and start an encrypted conversation.
          </p>
        </div>

        <button
          onClick={() => navigate("/add-Contacts")}
          className="sheen press w-full h-12 rounded-2xl bg-primary text-primary-content font-bold tracking-wide glow-primary transition-transform duration-400 hover:-translate-y-0.5"
        >
          Add your first contact
        </button>
      </div>
    </aside>
  );
};

export default NoContacts;
