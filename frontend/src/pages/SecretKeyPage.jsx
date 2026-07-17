import React, { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { useNavigate } from "react-router-dom";
import { KeyRound, Copy, Check, X } from "lucide-react";

const SecretKeyPage = () => {
  const { authUser } = useAuthStore();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const secretKey =
    localStorage.getItem(`${authUser.email}_secret_key`) || "No key found.";

  const handleCopy = () => {
    navigator.clipboard.writeText(secretKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-base-300/60 backdrop-blur-sm">
      <div className="glass w-full max-w-md bg-base-100/50 backdrop-blur-xl border border-white/10 p-8 sm:p-10 rounded-3xl relative overflow-hidden shadow-2xl">
        <button
          onClick={() => navigate("/profile")}
          className="absolute top-4 right-4 p-2 bg-base-200/50 hover:bg-base-300/50 rounded-full transition-colors z-20"
        >
          <X className="size-5" />
        </button>
        {/* Subtle background glow effect */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-secondary/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="relative z-10">

          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-6 shadow-inner">
              <KeyRound className="size-8" />
            </div>
            <h1 className="text-3xl font-semibold tracking-tight text-base-content mb-2">
              Your Secret Key
            </h1>
            <p className="text-base-content/60 text-sm">
              Keep this safe. Do not share it with anyone.
            </p>
          </div>

          <div className="bg-base-100/50 backdrop-blur-md rounded-2xl p-6 border border-base-content/10 transition-all duration-300">
            <p className="text-xs text-base-content/50 uppercase font-semibold tracking-wider mb-3">
              Current Key
            </p>
            <div className="flex items-center gap-3">
              <input
                type="text"
                readOnly
                value={secretKey}
                className="w-full bg-transparent border-none text-base-content font-mono text-sm focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="btn btn-circle btn-sm bg-primary/10 hover:bg-primary/20 border-none text-primary transition-all duration-300"
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecretKeyPage;
