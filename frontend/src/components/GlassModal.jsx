import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Shared frosted dialog: blurred backdrop, spring-in card, Escape and
 * click-outside to dismiss. Pass `dismissible={false}` for flows the user
 * must not skip.
 */
const GlassModal = ({
  onClose,
  icon: Icon,
  title,
  subtitle,
  children,
  className = "",
  dismissible = true,
}) => {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && dismissible) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, dismissible]);

  return (
    <div
      className="glass-backdrop fixed inset-0 z-[90] flex items-center justify-center p-4"
      onClick={() => dismissible && onClose?.()}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`glass-panel animate-modal-in w-full max-w-md p-7 sm:p-9 rounded-[2rem] flex flex-col max-h-[88vh] ${className}`}
      >
        <button
          onClick={() => onClose?.()}
          className="glass-tile glass-hover press absolute top-4 right-4 size-9 rounded-xl grid place-items-center text-base-content/60 hover:text-base-content z-20"
          aria-label="Close"
        >
          <X className="size-4.5" />
        </button>

        <div className="relative z-10 flex flex-col min-h-0">
          {(Icon || title) && (
            <div className="text-center mb-7">
              {Icon && (
                <div className="relative inline-block mb-5">
                  <div className="absolute inset-0 rounded-[1.4rem] bg-primary/30 blur-xl scale-110" />
                  <div className="brand-mark relative size-14 rounded-[1.4rem] grid place-items-center">
                    <Icon className="size-7 text-primary-content" />
                  </div>
                </div>
              )}
              {title && (
                <h1 className="text-2xl font-bold tracking-tight text-gradient">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-base-content/50 mt-2">{subtitle}</p>
              )}
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  );
};

export default GlassModal;
