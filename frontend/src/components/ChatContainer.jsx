import ChatHeader from "./ChatHeader";
import { useChatStore } from '../stores/useChatStore';
import MessageSkeleton from "./skeletons/MessageSkeleton";
import MessageInput from "./MessageInput";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { formatMessageTime } from "../lib/utils";

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

  useEffect(()=>{
    getMessages(selectedUser._id);
    subscribeToMessages();

    return ()=>unsubscribeFromMessages();
  },[selectedUser._id,getMessages,subscribeToMessages,unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const messageEndRef = useRef();

  if(isMessagesLoading){
    return(
      <div>
        <ChatHeader/>
        <MessageSkeleton/>
        <MessageInput/>
      </div>
    )
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
              <div className="size-10 rounded-full border border-base-content/10 shadow-sm">
                <img src={message.senderId===authUser._id?authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"} />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className={`chat-bubble flex flex-col shadow-sm ${message.senderId === authUser._id ? "bg-primary text-primary-content" : "glass-panel"}`}>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              {message.text && <p>{message.text}</p>}
            </div>
          </div>
        ))}
      </div>
      <MessageInput/>
    </div>
  );
}

export default ChatContainer