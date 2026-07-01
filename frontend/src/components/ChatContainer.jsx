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
    <div>
      <ChatHeader />
      {/*Showing messages*/}
      <div>
        {messages.map((message) => (
          <div
            key={message._id}
            ref={messageEndRef}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
          >
            <img src={message.senderId===authUser._id?authUser.profilePic || "/avatar.png" : selectedUser.profilePic || "/avatar.png"} />
            <time>
              {formatMessageTime(message.createdAt)}
            </time>
            <div>
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
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