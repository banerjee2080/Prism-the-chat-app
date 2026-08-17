import { Image as ImageIcon, Send, X, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../stores/useChatStore.js";

const MessageInput = () => {
  const { sendMessage, isMessageSending } = useChatStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

  const canSend = (text.trim() || imagePreview) && !isMessageSending;

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Please Select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Compress as WebP at 70% quality for lightning-fast uploads
        const compressedBase64 = canvas.toDataURL("image/webp", 0.7);
        setImagePreview(compressedBase64);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="relative px-3 sm:px-6 pb-4 pt-2 shrink-0">
      {/* Fade so messages dissolve into the composer instead of hitting an edge */}
      <div className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-base-100/40 to-transparent" />

      {imagePreview && (
        <div className="max-w-4xl mx-auto mb-3 animate-pop">
          <div className="glass-card inline-flex items-center gap-3 p-2 pr-4 rounded-2xl">
            <div className="relative">
              <img
                src={imagePreview}
                alt="Attachment preview"
                className="size-16 object-cover rounded-xl"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute -top-2 -right-2 size-6 rounded-full grid place-items-center bg-base-300 border border-base-content/10 text-base-content shadow-lg press hover:bg-error hover:text-error-content transition-colors"
                aria-label="Remove attachment"
              >
                <X className="size-3.5" />
              </button>
            </div>
            <div className="text-xs">
              <p className="font-semibold text-base-content/80">Image ready</p>
              <p className="text-base-content/50">Send to share it</p>
            </div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 sm:gap-3 w-full max-w-4xl mx-auto"
      >
        <div className="glass-field flex-1 min-w-0 flex items-center h-12 pl-5 pr-1.5">
          <input
            type="text"
            placeholder="Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 min-w-0 bg-transparent border-none outline-none text-base-content caret-primary text-[15px] placeholder:text-base-content/40"
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="size-9 rounded-full grid place-items-center text-base-content/45 hover:text-primary hover:bg-primary/10 press transition-colors"
            aria-label="Attach image"
          >
            <ImageIcon className="size-5" />
          </button>
        </div>

        <button
          type="submit"
          disabled={!canSend}
          className={`relative size-12 shrink-0 rounded-full grid place-items-center press transition-all duration-400 ${
            canSend
              ? "bg-primary text-primary-content glow-primary scale-100 hover:scale-105"
              : "glass-tile text-base-content/30 scale-95"
          }`}
          aria-label="Send message"
        >
          {isMessageSending ? (
            <Loader2 className="size-5 animate-spin" />
          ) : (
            <Send className={`size-5 transition-transform duration-400 ${canSend ? "translate-x-px" : ""}`} />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
