import ChatHeader from "./ChatHeader.jsx";
import { useChatStore } from "../stores/useChatStore.js";
import MessageSkeleton from "./skeletons/MessageSkeleton.jsx";
import MessageInput from "./MessageInput.jsx";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { formatMessageTime } from "../lib/utils.js";
import { X, Check, CheckCheck } from "lucide-react";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    getMessages(selectedUser._id);
  }, [
    selectedUser._id,
    getMessages,
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
    <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-base-100/20">
      <ChatHeader />
      {/*Showing messages*/}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((message) => {
          const isSent = message.senderId === authUser._id;
          return (
            <div
              key={message._id}
              ref={messageEndRef}
              className={`chat ${isSent ? "chat-end" : "chat-start"} animate-in slide-in-from-bottom-2 fade-in duration-300`}
            >
              <div className="chat-image avatar">
                <div className="size-10 rounded-[1.2rem] shadow-sm shadow-base-content/10">
                  <img
                    src={
                      isSent
                        ? authUser.profilePic || "/avatar.png"
                        : selectedUser.profilePic || "/avatar.png"
                    }
                  />
                </div>
              </div>
              <div className="chat-header mb-1.5 opacity-0 transition-opacity duration-300">
                <time className="text-[10px] font-semibold uppercase tracking-wider text-base-content/50 mx-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div
                className={`chat-bubble flex flex-col relative group px-5 py-3.5 shadow-sm
                  ${isSent 
                    ? "bg-primary text-primary-content rounded-[1.5rem] rounded-tr-sm shadow-primary/20" 
                    : "bg-base-100/80 backdrop-blur-md border border-base-content/5 text-base-content rounded-[1.5rem] rounded-tl-sm"}
                `}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[220px] rounded-[1rem] mb-2 cursor-pointer hover:scale-[1.02] transition-transform duration-300 shadow-sm shadow-black/20"
                    onClick={() => setSelectedImage(message.image)}
                  />
                )}
                {message.text && <p className="text-[15px] leading-relaxed">{message.text}</p>}
                
                <div className={`flex items-center gap-1 absolute -bottom-5 ${isSent ? 'right-2' : 'left-2'}`}>
                  <p className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity text-base-content/60">
                    {formatMessageTime(message.createdAt)}
                  </p>
                  {isSent && (
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                      {message.isRead ? (
                        <CheckCheck className="size-4 text-info" />
                      ) : (
                        <Check className="size-4 text-base-content/40" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <MessageInput />

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="fixed top-4 right-4 z-[110] btn btn-circle bg-base-300/50 hover:bg-base-300 border-none text-white hover:text-base-content shadow-2xl transition-all"
            onClick={() => setSelectedImage(null)}
          >
            <X className="size-6" />
          </button>
          
          <div
            className="relative max-w-7xl max-h-[90vh] w-full flex items-center justify-center cursor-default"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Enlarged attachment"
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl shadow-black"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
