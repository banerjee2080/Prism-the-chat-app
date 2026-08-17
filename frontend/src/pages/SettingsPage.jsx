import { THEMES, NOTIFICATION_SOUNDS } from "../constants/index.js";
import { useThemeStore } from "../stores/useThemeStore.js";
import {
  Send,
  ArrowLeft,
  Volume2,
  VolumeX,
  Palette,
  Check,
  Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's the new look?", isSent: false },
  { id: 2, content: "Honestly? It's gorgeous.", isSent: true },
];

const Section = ({ icon: Icon, title, description, children }) => (
  <section className="glass-panel animate-glass-rise p-6 sm:p-8 rounded-[2rem]">
    <div className="relative z-10">
      <div className="flex items-start gap-4 mb-7">
        <div className="brand-mark size-11 rounded-[1.1rem] grid place-items-center shrink-0">
          <Icon className="size-5 text-primary-content" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-base-content/90">
            {title}
          </h2>
          <p className="text-sm text-base-content/50 mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  </section>
);

/** A miniature of the app rendered in the candidate theme. */
const ThemeCard = ({ theme, isActive, onSelect, index }) => (
  <button
    onClick={onSelect}
    style={{ "--i": index }}
    className={`stagger animate-glass-rise group relative p-2.5 rounded-[1.4rem] border text-left transition-all duration-400 press ${
      isActive
        ? "border-primary/50 bg-primary/10 shadow-[0_18px_40px_-24px_var(--glass-shadow)]"
        : "border-base-content/10 hover:border-base-content/25 hover:bg-base-content/5 hover:-translate-y-1"
    }`}
  >
    <div
      data-theme={theme.id}
      className="relative h-20 rounded-[1rem] overflow-hidden bg-base-100 p-2 flex flex-col justify-between"
    >
      <div className="flex justify-start">
        <span className="h-3.5 w-12 rounded-full bg-base-300" />
      </div>
      <div className="flex justify-end">
        <span className="h-4 w-16 rounded-full bg-primary" />
      </div>
      <div className="flex gap-1">
        <span className="h-2 flex-1 rounded-full bg-secondary" />
        <span className="h-2 flex-1 rounded-full bg-accent" />
        <span className="h-2 flex-1 rounded-full bg-neutral" />
      </div>
    </div>

    <div className="flex items-center justify-between gap-2 px-1 pt-2.5 pb-0.5">
      <div className="min-w-0">
        <p
          className={`text-sm font-bold truncate ${
            isActive ? "text-primary" : "text-base-content/85"
          }`}
        >
          {theme.label}
        </p>
        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-base-content/35 truncate">
          {theme.mode}
        </p>
      </div>
      {isActive && (
        <span className="animate-pop size-5 rounded-full bg-primary text-primary-content grid place-items-center shrink-0">
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}
    </div>
  </button>
);

const SettingsPage = () => {
  const {
    theme,
    setTheme,
    notificationSound,
    setNotificationSound,
    isMuted,
    setIsMuted,
  } = useThemeStore();
  const navigate = useNavigate();

  const chooseSound = (soundId) => {
    setNotificationSound(soundId);
    // Play it back so the choice is audible, not just a label.
    if (!isMuted) {
      const audio = new Audio(`/sounds/${soundId}.mp3`);
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  };

  return (
    <div className="flex-1 overflow-y-auto scroll-area w-full py-6 px-4">
      <div className="mx-auto max-w-5xl space-y-6">
        <button
          onClick={() => navigate("/")}
          className="glass-tile glass-hover press inline-flex items-center gap-2 h-10 px-4 rounded-2xl text-sm font-semibold text-base-content/70"
        >
          <ArrowLeft className="size-4" />
          Back to chats
        </button>

        <Section
          icon={Palette}
          title="Appearance"
          description="Every theme is tuned for the glass surfaces — pick the light you like."
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {THEMES.map((t, i) => (
              <ThemeCard
                key={t.id}
                theme={t}
                index={i}
                isActive={theme === t.id}
                onSelect={() => setTheme(t.id)}
              />
            ))}
          </div>
        </Section>

        <Section
          icon={isMuted ? VolumeX : Volume2}
          title="Sound"
          description="Choose the tone for incoming messages. Tap one to hear it."
        >
          <div className="flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-base-content/45">
                Notification tone
              </p>
              <div className="glass-tile inline-flex p-1.5 rounded-2xl gap-1">
                {NOTIFICATION_SOUNDS.map((sound) => {
                  const active = notificationSound === sound.id;
                  return (
                    <button
                      key={sound.id}
                      onClick={() => chooseSound(sound.id)}
                      className={`press flex items-center gap-2 h-9 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        active
                          ? "bg-primary text-primary-content glow-primary"
                          : "text-base-content/60 hover:text-base-content hover:bg-base-content/8"
                      }`}
                    >
                      {active && <Play className="size-3" fill="currentColor" />}
                      {sound.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <label className="glass-tile glass-hover flex items-center justify-between gap-4 h-14 px-5 rounded-2xl cursor-pointer lg:min-w-[15rem]">
              <span className="flex items-center gap-3 text-sm font-semibold text-base-content/75">
                {isMuted ? (
                  <VolumeX className="size-5 text-error" />
                ) : (
                  <Volume2 className="size-5 text-primary" />
                )}
                Mute everything
              </span>
              <input
                type="checkbox"
                checked={isMuted}
                onChange={(e) => setIsMuted(e.target.checked)}
                className="toggle toggle-sm toggle-error"
              />
            </label>
          </div>
        </Section>

        <Section
          icon={Send}
          title="Preview"
          description="This is exactly how conversations will look with your settings."
        >
          <div className="glass-card rounded-[1.6rem] overflow-hidden">
            {/* Mock header */}
            <div className="glass-bar rounded-none border-x-0 border-t-0 px-5 py-3.5 flex items-center gap-3">
              <div className="brand-mark size-10 rounded-[1.1rem] grid place-items-center text-primary-content font-bold text-sm">
                JD
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight">John Doe</h3>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-success">
                  Online
                </p>
              </div>
            </div>

            {/* Mock thread */}
            <div className="px-5 py-6 space-y-2 min-h-[13rem] flex flex-col justify-end">
              <div className="day-divider">
                <span className="glass-tile px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.16em] text-base-content/50">
                  Today
                </span>
              </div>
              {PREVIEW_MESSAGES.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`bubble ${message.isSent ? "bubble-out" : "bubble-in"}`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Mock composer */}
            <div className="px-4 pb-4 pt-1 flex items-center gap-3">
              <div className="glass-field flex-1 flex items-center h-11 px-5 text-sm text-base-content/45">
                Message
              </div>
              <span className="size-11 rounded-full bg-primary text-primary-content grid place-items-center glow-primary">
                <Send className="size-4.5" />
              </span>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

export default SettingsPage;
