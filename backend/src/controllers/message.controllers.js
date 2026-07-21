import Message from "../models/messages.model.js";
import User from "../models/user.model.js";
import { getReceiverSocketId, io } from "../lib/Socket.js";

export const getAllUsers = async (req, res) => {
  try {
    const loggedInUser = req.user;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUser._id },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error occurred while fetching users: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const getSidebarUsers = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;

    // Get contact IDs
    const loggedInUser = await User.findById(loggedInUserId);
    const contactIds = loggedInUser.contacts.map((c) => c._id.toString());

    // Get users who have sent a message to me
    const messages = await Message.find({ receiverId: loggedInUserId }).select("senderId");
    const messageSenderIds = messages.map((m) => m.senderId.toString());

    // Merge and unique
    const allUserIds = [...new Set([...contactIds, ...messageSenderIds])];

    const sidebarUsers = await User.find({
      _id: { $in: allUserIds, $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(sidebarUsers);
  } catch (error) {
    console.log("Error occurred while fetching sidebar users: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const sender_id = req.user._id;
    const receiver_id = req.params.id;

    const messages = await Message.find({
      $or: [
        { senderId: sender_id, receiverId: receiver_id },
        { senderId: receiver_id, receiverId: sender_id },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getAllMessages: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.id;

    const { text, image, textNonce, imageNonce } = req.body;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image,
      textNonce,
      imageNonce,
    });

    await newMessage.save();
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sending Message: ", error);
    res.status(500).json({ message: error.message });
  }
};
