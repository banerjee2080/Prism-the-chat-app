import ChatHeader from "./ChatHeader.jsx";
import { useChatStore } from "../stores/useChatStore.js";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import MessageInput from "./MessageInput.jsx";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";
import { X } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [
    selectedUser._id,
    getMessages,
    subscribeToMessages,
    unsubscribeFromMessages,
  ]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const messageEndRef = useRef();

  if (isMessagesLoading) {
    return (
      <div>
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }
  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100/20">
      <ChatHeader />
      {/*Showing messages*/}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            ref={messageEndRef}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border border-base-content/10 shadow-sm shadow-base-content/10">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                  }
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div
              className={`chat-bubble flex flex-col shadow-sm shadow-base-content/5 rounded-3xl ${message.senderId === authUser._id ? "bg-primary text-primary-content" : "glass-panel"}`}
            >
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-2xl mb-2 cursor-pointer hover:opacity-90 transition-opacity shadow-sm shadow-base-content/10"
                  onClick={() => setSelectedImage(message.image)}
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput />

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged attachment"
              className="max-w-full max-h-[90vh] object-contain rounded-3xl shadow-2xl shadow-base-content/5"
            />
            <button
              className="absolute top-4 right-4 md:-top-4 md:-right-4 btn btn-circle btn-sm btn-ghost bg-base-100/50 hover:bg-base-100/80 text-base-content shadow-sm shadow-base-content/10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="size-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
