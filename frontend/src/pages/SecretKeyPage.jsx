import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import { KeyRound, Copy, Check, Eye, EyeOff, ShieldAlert } from "lucide-react";
import GlassModal from "../components/GlassModal.jsx";

const SecretKeyPage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const secretKey =
    localStorage.getItem(`${authUser.email}_secret_key`) || "No key found.";

  const handleCopy = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <GlassModal
      onClose={() => navigate("/profile")}
      icon={KeyRound}
      title="Your secret key"
      subtitle="This key decrypts your messages. Never share it."
    >
      <div className="glass-card p-5 rounded-[1.4rem]">
        <div className="flex items-center justify-between gap-3 mb-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-base-content/40">
            Current key
          </p>
          <button
            onClick={() => setRevealed((v) => !v)}
            className="press flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-base-content/50 hover:text-base-content transition-colors"
          >
            {revealed ? (
              <EyeOff className="size-3.5" />
            ) : (
              <Eye className="size-3.5" />
            )}
            {revealed ? "Hide" : "Reveal"}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <p
            className={`flex-1 min-w-0 font-mono text-sm break-all transition-all duration-300 ${
              revealed
                ? "text-base-content/90"
                : "text-base-content/40 blur-[6px] select-none"
            }`}
          >
            {secretKey}
          </p>
          <button
            onClick={handleCopy}
            className="glass-tile glass-hover press size-10 rounded-xl grid place-items-center text-primary shrink-0"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="size-4 text-success animate-pop" />
            ) : (
              <Copy className="size-4" />
            )}
          </button>
        </div>
      </div>

      <div className="flex items-start gap-3 mt-4 px-1">
        <ShieldAlert className="size-4 text-warning shrink-0 mt-0.5" />
        <p className="text-xs text-base-content/50 leading-relaxed">
          Anyone with this key can read your conversations. Store it in a
          password manager — you'll need it to sign in on a new device.
        </p>
      </div>
    </GlassModal>
  );
};

export default SecretKeyPage;
