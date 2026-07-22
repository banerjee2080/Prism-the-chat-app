import { Image as ImageIcon, Send, X } from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { useChatStore } from "../stores/useChatStore.js";

const MessageInput = () => {
  const { sendMessage, isMessageSending } = useChatStore();
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef();

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
    <div className="p-4 sm:p-6 w-full sticky bottom-0 z-10 bg-gradient-to-t from-base-100/80 to-transparent pt-10">
      {imagePreview && (
        <div className="mb-4 flex items-center gap-2 max-w-4xl mx-auto animate-in slide-in-from-bottom-2 fade-in">
          <div className="relative group">
            <img
              src={imagePreview}
              alt="preview"
              className="h-24 w-24 object-cover rounded-[1.5rem] border border-base-content/10 shadow-lg shadow-black/10 transition-transform group-hover:scale-[1.02]"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 size-7 rounded-full bg-base-300 flex items-center justify-center border border-base-content/10 shadow-md hover:bg-base-200 transition-colors z-20"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-3 max-w-4xl mx-auto"
      >
        <div className="flex-1 flex items-center bg-base-200/60 backdrop-blur-xl rounded-full border border-base-content/10 shadow-lg shadow-base-content/5 p-1.5 transition-all focus-within:bg-base-100/80 focus-within:border-primary/30 focus-within:shadow-xl focus-within:shadow-primary/5">
          <input
            type="text"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-[15px] px-5 placeholder:text-base-content/40 h-10"
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
            className="btn btn-ghost btn-circle size-10 min-h-0 text-base-content/50 hover:text-primary hover:bg-primary/10 transition-colors mr-1"
          >
            <ImageIcon className="size-5" />
          </button>
        </div>
        <button
          type="submit"
          disabled={(!text.trim() && !imagePreview) || isMessageSending}
          className="btn btn-circle btn-primary size-12 min-h-0 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 transition-all disabled:opacity-50 disabled:scale-100"
        >
          <Send className="size-5 ml-1" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
