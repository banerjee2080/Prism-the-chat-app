import { THEMES } from "../constants/index.js";
import { useThemeStore } from "../stores/useThemeStore.js";
import { Send, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  {
    id: 2,
    content: "I'm doing great! Just working on some new features.",
    isSent: true,
  },
];

const SettingsPage = () => {
  const { theme, setTheme, notificationSound, setNotificationSound, isMuted, setIsMuted } = useThemeStore();
  const navigate = useNavigate();

  return (
    <div className="flex-1 overflow-y-auto w-full pt-20 pb-10 bg-base-200/50">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <button 
          onClick={() => navigate("/")} 
          className="btn btn-sm btn-ghost mb-2 flex items-center gap-2 hover:bg-base-300 rounded-full px-4 transition-all"
        >
          <ArrowLeft className="size-4" />
          Back to Home
        </button>

        <div className="bg-base-100/60 backdrop-blur-xl border border-base-content/10 p-8 rounded-[2rem] shadow-2xl shadow-base-content/5">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Theme Customization
            </h2>
            <p className="text-sm text-base-content/70">
              Personalize your chat experience with our curated premium themes.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {THEMES.map((t) => (
              <button
                key={t}
                className={`
                  group flex flex-col items-center gap-3 p-4 rounded-3xl transition-all duration-300 border
                  ${theme === t 
                    ? "bg-base-200 border-primary shadow-lg shadow-primary/20 scale-105" 
                    : "bg-base-100/50 border-base-content/10 hover:bg-base-200/80 hover:border-primary/50 hover:scale-105"}
                `}
                onClick={() => setTheme(t)}
              >
                <div
                  className="relative h-12 w-full rounded-2xl overflow-hidden shadow-inner"
                  data-theme={t}
                >
                  <div className="absolute inset-0 grid grid-cols-4 gap-px p-1">
                    <div className="rounded-l-xl bg-primary"></div>
                    <div className="bg-secondary"></div>
                    <div className="bg-accent"></div>
                    <div className="rounded-r-xl bg-neutral"></div>
                  </div>
                </div>
                <span className={`text-sm font-semibold tracking-wide truncate w-full text-center transition-colors
                  ${theme === t ? "text-primary" : "text-base-content/80 group-hover:text-base-content"}
                `}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-base-100/60 backdrop-blur-xl border border-base-content/10 p-8 rounded-[2rem] shadow-2xl shadow-base-content/5 mt-8">
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Audio Settings
            </h2>
            <p className="text-sm text-base-content/70">
              Customize your notification sounds and mute preferences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between bg-base-200/50 p-6 rounded-3xl border border-base-content/5">
            <div className="flex-1 space-y-4 w-full">
              <label className="text-sm font-semibold text-base-content/80 tracking-wide uppercase">Notification Sound</label>
              <div className="flex flex-wrap gap-3">
                {["default", "pop", "bell"].map((sound) => (
                  <button
                    key={sound}
                    onClick={() => setNotificationSound(sound)}
                    className={`btn btn-sm rounded-full px-6 transition-all ${notificationSound === sound ? "btn-primary shadow-md shadow-primary/20 scale-105" : "btn-ghost bg-base-100/50 hover:bg-base-300"}`}
                  >
                    {sound.charAt(0).toUpperCase() + sound.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <div className="divider sm:divider-horizontal"></div>
            <div className="flex items-center gap-4">
              <label className="text-sm font-semibold text-base-content/80 tracking-wide uppercase">Mute Notifications</label>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`btn btn-circle ${isMuted ? "btn-error shadow-md shadow-error/20" : "btn-ghost bg-base-100/50 hover:bg-base-300"}`}
              >
                {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-base-100/60 backdrop-blur-xl border border-base-content/10 p-8 rounded-[2rem] shadow-2xl shadow-base-content/5 mt-8">
          <h3 className="text-2xl font-bold mb-6 text-base-content">Live Preview</h3>
          <div className="rounded-[2.5rem] p-1 bg-gradient-to-tr from-primary/30 via-secondary/20 to-accent/30 shadow-2xl shadow-primary/10">
            <div className="rounded-[2.4rem] bg-base-200 overflow-hidden">
              <div className="max-w-2xl mx-auto py-8 px-4">
                {/* Mock Chat UI */}
                <div className="bg-base-100 rounded-3xl shadow-xl border border-base-content/5 overflow-hidden flex flex-col transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                  {/* Chat Header */}
                  <div className="px-6 py-4 border-b border-base-300 bg-base-100/80 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-primary-content font-bold shadow-md">
                        JD
                      </div>
                      <div>
                        <h3 className="font-semibold text-base">John Doe</h3>
                        <p className="text-xs font-medium text-emerald-500">Online</p>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="p-6 space-y-6 min-h-[320px] max-h-[320px] overflow-y-auto bg-base-100/50">
                    {PREVIEW_MESSAGES.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isSent ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 fade-in duration-300`}
                      >
                        <div
                          className={`
                            max-w-[75%] rounded-[1.5rem] p-4 shadow-sm relative group
                            ${message.isSent 
                              ? "bg-primary text-primary-content rounded-tr-sm" 
                              : "bg-base-200 text-base-content rounded-tl-sm"}
                          `}
                        >
                          <p className="text-[15px] leading-relaxed">{message.content}</p>
                          <p
                            className={`
                              text-[10px] mt-2 font-medium opacity-0 group-hover:opacity-100 transition-opacity absolute -bottom-5
                              ${message.isSent ? "right-2 text-base-content/60" : "left-2 text-base-content/60"}
                            `}
                          >
                            12:00 PM
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 border-t border-base-300 bg-base-100/80 backdrop-blur-md">
                    <div className="flex gap-3 items-center bg-base-200/50 p-1.5 rounded-full border border-base-content/10 transition-colors focus-within:border-primary/50 focus-within:bg-base-100">
                      <input
                        type="text"
                        className="bg-transparent border-none focus:outline-none focus:ring-0 flex-1 text-sm h-10 px-4 placeholder:text-base-content/40"
                        placeholder="Type a message..."
                        value="This is a preview"
                        readOnly
                      />
                      <button className="btn btn-primary btn-circle h-10 w-10 min-h-0 shadow-md shadow-primary/20 hover:scale-105 transition-transform">
                        <Send size={18} className="ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPage;
