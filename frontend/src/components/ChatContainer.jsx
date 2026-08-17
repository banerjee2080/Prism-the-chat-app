import ChatHeader from "./ChatHeader.jsx";
import { useChatStore } from "../stores/useChatStore.js";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import MessageInput from "./MessageInput.jsx";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { formatMessageTime, formatDayLabel, isSameDay } from "../lib/utils.js";
import { X } from "lucide-react";

/** Messages from the same sender within this window render as one visual run. */
const GROUP_WINDOW_MS = 5 * 60 * 1000;

const ChatContainer = () => {
  const { messages, getMessages, isMessagesLoading, selectedUser } =
    useChatStore();
  const { authUser } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [selectedUser._id, getMessages]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Close the lightbox with Escape.
  useEffect(() => {
    if (!selectedImage) return;
    const onKey = (e) => e.key === "Escape" && setSelectedImage(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedImage]);

  /** Pre-compute grouping so the render stays declarative. */
  const rows = useMemo(() => {
    return messages.map((message, index) => {
      const prev = messages[index - 1];
      const next = messages[index + 1];
      const at = new Date(message.createdAt);

      const startsNewDay = !prev || !isSameDay(at, new Date(prev.createdAt));
      const groupedWithPrev =
        !!prev &&
        !startsNewDay &&
        prev.senderId === message.senderId &&
        at - new Date(prev.createdAt) < GROUP_WINDOW_MS;
      const groupedWithNext =
        !!next &&
        isSameDay(at, new Date(next.createdAt)) &&
        next.senderId === message.senderId &&
        new Date(next.createdAt) - at < GROUP_WINDOW_MS;

      return { message, startsNewDay, groupedWithPrev, groupedWithNext };
    });
  }, [messages]);

  const lastSentMessage = [...messages]
    .reverse()
    .find((m) => m.senderId === authUser._id);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
      <ChatHeader />

      {messages.length === 0 ? (
        <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center px-6 animate-glass-rise">
          <img
            src={selectedUser.profilePic || "/avatar.png"}
            alt={selectedUser.fullName}
            className="size-20 rounded-[1.6rem] object-cover mb-4 animate-float"
          />
          <h3 className="text-lg font-bold text-base-content/90">
            {selectedUser.fullName}
          </h3>
          <p className="text-sm text-base-content/50 mt-1 max-w-xs">
            This is the beginning of your encrypted conversation. Say hello.
          </p>
        </div>
      ) : (
        <div className="scroll-area flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-5">
          <div className="flex flex-col">
            {rows.map(
              (
                { message, startsNewDay, groupedWithPrev, groupedWithNext },
                index,
              ) => {
                const isSent = message.senderId === authUser._id;
                const showAvatar = !groupedWithNext;
                const isLastSent = lastSentMessage?._id === message._id;

                return (
                  <div key={message._id}>
                    {startsNewDay && (
                      <div className="day-divider px-2 my-4">
                        <span className="glass-tile px-3.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.16em] text-base-content/50">
                          {formatDayLabel(message.createdAt)}
                        </span>
                      </div>
                    )}

                    <div
                      className={`group flex items-end gap-2 ${
                        isSent ? "justify-end" : "justify-start"
                      } ${groupedWithPrev ? "mt-0.5" : "mt-3"}`}
                      style={{ "--i": Math.min(index, 12) }}
                    >
                      {/* Avatar rail (incoming only) */}
                      {!isSent && (
                        <div className="w-8 shrink-0 self-end">
                          {showAvatar && (
                            <img
                              src={selectedUser.profilePic || "/avatar.png"}
                              alt={selectedUser.fullName}
                              className="size-8 rounded-full object-cover mb-0.5"
                            />
                          )}
                        </div>
                      )}

                      {/* Hover timestamp, outgoing side */}
                      {isSent && (
                        <time className="shrink-0 text-[10px] font-medium tabular-nums text-base-content/40 opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          {formatMessageTime(message.createdAt)}
                        </time>
                      )}

                      <div
                        className={`animate-bubble-pop bubble ${
                          isSent ? "bubble-out" : "bubble-in"
                        } ${groupedWithPrev ? "is-mid-top" : ""} ${
                          groupedWithNext ? "is-mid-bottom" : ""
                        } ${message.image && !message.text ? "!p-1.5" : ""}`}
                      >
                        {message.image && (
                          <button
                            type="button"
                            onClick={() => setSelectedImage(message.image)}
                            className={`block overflow-hidden rounded-[1rem] press ${
                              message.text ? "mb-2" : ""
                            }`}
                          >
                            <img
                              src={message.image}
                              alt="Attachment"
                              className="max-w-[220px] w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                            />
                          </button>
                        )}
                        {message.text && <p>{message.text}</p>}
                      </div>

                      {/* Hover timestamp, incoming side */}
                      {!isSent && (
                        <time className="shrink-0 text-[10px] font-medium tabular-nums text-base-content/40 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          {formatMessageTime(message.createdAt)}
                        </time>
                      )}
                    </div>

                    {/* iMessage-style receipt under the newest outgoing message */}
                    {isSent && isLastSent && (
                      <div className="flex justify-end pr-1 mt-1 animate-fade-in">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-base-content/40">
                          {message.isRead ? "Read" : "Delivered"}
                        </span>
                      </div>
                    )}
                  </div>
                );
              },
            )}
          </div>

          <div ref={messageEndRef} className="h-2" />
        </div>
      )}

      <MessageInput />

      {/* Image lightbox */}
      {selectedImage && (
        <div
          className="glass-backdrop fixed inset-0 z-[100] flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="glass-tile glass-hover press fixed top-5 right-5 z-[110] size-11 rounded-2xl grid place-items-center text-base-content"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image"
          >
            <X className="size-5" />
          </button>

          <img
            src={selectedImage}
            alt="Enlarged attachment"
            onClick={(e) => e.stopPropagation()}
            className="animate-modal-in max-w-full max-h-[88vh] object-contain rounded-[1.5rem] cursor-default shadow-[0_40px_90px_-30px_rgb(0_0_0/0.7)]"
          />
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
