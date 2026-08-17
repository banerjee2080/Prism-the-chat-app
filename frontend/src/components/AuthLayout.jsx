import { MessageSquare } from "lucide-react";

/** Shared frame for the login and sign-up cards. */
export const AuthShell = ({ title, subtitle, children, footer }) => (
  <div className="flex-1 overflow-y-auto scroll-area">
    <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
      <div className="glass-panel animate-glass-rise w-full max-w-md p-8 sm:p-10 rounded-[2rem] overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col items-center text-center mb-9">
            <div className="relative mb-5">
              <div className="absolute inset-0 rounded-[1.4rem] bg-primary/35 blur-xl scale-110" />
              <div className="brand-mark relative size-14 rounded-[1.4rem] grid place-items-center animate-float">
                <MessageSquare className="size-7 text-primary-content" />
              </div>
            </div>
            <h1 className="text-[1.75rem] font-bold tracking-tight text-gradient">
              {title}
            </h1>
            <p className="text-sm text-base-content/50 mt-2">{subtitle}</p>
          </div>

          {children}

          {footer && (
            <div className="text-center mt-8 text-sm text-base-content/50">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

/** Glass input with a leading icon and an optional trailing slot. */
export const AuthField = ({
  icon: Icon,
  label,
  trailing,
  className = "",
  ...inputProps
}) => (
  <label className="block">
    <span className="block text-[11px] font-bold uppercase tracking-[0.14em] text-base-content/50 mb-2 ml-1">
      {label}
    </span>
    <div className="glass-field flex items-center h-12 pl-4 pr-3 gap-3">
      <Icon className="size-4.5 shrink-0 text-base-content/40" />
      <input
        className={`flex-1 min-w-0 bg-transparent border-none outline-none text-base-content caret-primary text-[15px] placeholder:text-base-content/35 ${className}`}
        {...inputProps}
      />
      {trailing}
    </div>
  </label>
);

/** Full-width primary action with the glass sheen sweep. */
export const AuthButton = ({ loading, loadingLabel, children, ...props }) => (
  <button
    {...props}
    disabled={loading || props.disabled}
    className="sheen press w-full h-12 rounded-2xl bg-primary text-primary-content font-bold tracking-wide glow-primary transition-all duration-400 hover:-translate-y-0.5 disabled:opacity-60 disabled:translate-y-0 flex items-center justify-center gap-2 mt-8"
  >
    {loading ? loadingLabel : children}
  </button>
);
