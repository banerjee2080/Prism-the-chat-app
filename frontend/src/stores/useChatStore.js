import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { useAuthStore } from "./useAuthStore.js";
import { encryptText, decryptText } from "../lib/crypto.js";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
const socket = io(BASE_URL);

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  contacts: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isMessageSending: false,
  isContactsLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    set({ isMessageSending: true });
    try {
      const secretKey = localStorage.getItem("chat_secret_key");
      const receiverPublicKey = selectedUser.publicKey;

      let encryptedImageUrl = "";
      let imageNonce = "";

      if (messageData.image) {
        // Upload to Cloudinary client-side
        const formData = new FormData();
        formData.append("file", messageData.image);
        // Ensure VITE_CLOUDINARY_UPLOAD_PRESET is set in .env
        formData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
        );

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        );
        const uploadData = await uploadRes.json();

        if (uploadData.secure_url) {
          const encryptedImage = encryptText(
            uploadData.secure_url,
            receiverPublicKey,
            secretKey,
          );
          encryptedImageUrl = encryptedImage.encryptedText;
          imageNonce = encryptedImage.nonce;
        } else {
          console.error("Cloudinary upload failed", uploadData);
          toast.error("Failed to upload image");
        }
      }

      const { encryptedText, nonce: textNonce } = encryptText(
        messageData.text,
        receiverPublicKey,
        secretKey,
      );

      const payload = {
        text: encryptedText,
        textNonce: textNonce,
        image: encryptedImageUrl,
        imageNonce: imageNonce,
      };
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        payload,
      );

      const localMessage = {
        ...res.data,
        text: messageData.text,
        image: messageData.image, // Use the local dataURL for immediate display
      };
      set((state) => ({ messages: [...state.messages, localMessage] }));
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isMessageSending: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);

      const mySecretKey = localStorage.getItem("chat_secret_key");
      const otherPersonPublicKey = get().selectedUser.publicKey;

      const decryptedMessages = res.data.map((msg) => {
        if (msg.text && msg.textNonce) {
          msg.text = decryptText(
            msg.text,
            msg.textNonce,
            otherPersonPublicKey,
            mySecretKey,
          );
        }
        if (msg.image && msg.imageNonce) {
          msg.image = decryptText(
            msg.image,
            msg.imageNonce,
            otherPersonPublicKey,
            mySecretKey,
          );
        }
        return msg;
      });

      set({ messages: decryptedMessages });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  setSelectedUser: (selectedUser) => {
    set({ selectedUser });
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
    if (!selectedUser) return;
    const socket = useAuthStore.getState().socket;

    socket.on("newMessage", (newMessage) => {
      if (newMessage.senderId !== selectedUser._id) return;
      const mySecretKey = localStorage.getItem("chat_secret_key");
      const otherPersonPublicKey = selectedUser.publicKey;

      if (newMessage.text && newMessage.textNonce) {
        newMessage.text = decryptText(
          newMessage.text,
          newMessage.textNonce,
          otherPersonPublicKey,
          mySecretKey,
        );
      }
      if (newMessage.image && newMessage.imageNonce) {
        newMessage.image = decryptText(
          newMessage.image,
          newMessage.imageNonce,
          otherPersonPublicKey,
          mySecretKey,
        );
      }

      set({ messages: [...get().messages, newMessage] });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },

  getContacts: async () => {
    set({ isContactsLoading: true });
    try {
      const res = await axiosInstance.get("/auth/getContacts");
      set({ contacts: res.data });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      set({ isContactsLoading: false });
    }
  },

  deleteContact: async (contactId) => {
    try {
      const res = await axiosInstance.delete(
        `/auth/delete/${contactId}`,
      );
      set((state) => ({
        contacts: state.contacts.filter((c) => c._id !== contactId),
      }));
      toast.success("Contact deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  },
}));
