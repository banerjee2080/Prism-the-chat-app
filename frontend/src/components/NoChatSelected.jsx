import { MessageSquare, Lock, Zap } from "lucide-react";

const HIGHLIGHTS = [
  { icon: Lock, label: "End-to-end encrypted" },
  { icon: Zap, label: "Delivered in real time" },
];

const NoChatSelected = () => {
  return (
    <div className="hidden lg:flex w-full flex-1 flex-col items-center justify-center p-16">
      <div className="animate-glass-rise max-w-sm w-full text-center flex flex-col items-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-[2rem] bg-primary/30 blur-2xl scale-110" />
          <div className="brand-mark relative size-24 rounded-[2rem] grid place-items-center animate-float">
            <MessageSquare className="size-11 text-primary-content" />
          </div>
        </div>

        <h2 className="text-3xl font-bold tracking-tight text-gradient">
          Welcome to Prism
        </h2>
        <p className="text-base-content/55 mt-3 leading-relaxed">
          Pick a conversation from the left, and it will open right here.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mt-7">
          {HIGHLIGHTS.map(({ icon: Icon, label }, i) => (
            <span
              key={label}
              style={{ "--i": i + 3 }}
              className="stagger animate-glass-rise glass-tile px-3.5 py-2 rounded-full flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-base-content/55"
            >
              <Icon className="size-3.5 text-primary" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NoChatSelected;
