import Message from "../models/messages.model.js"
import User from "../models/user.model.js"
import cloudinary from "../lib/cloudinary.js"

export const getAllUsers = async(req,res) => {
    try{
        const loggedInUser = req.user;
        const filteredUsers = await User.find({_id: { $ne: loggedInUser._id },}).select("-password");

        res.status(200).json(filteredUsers);
    }
    catch(error){
        console.log("Error occurred while fetching users: ",error);
        res.status(500).json({ message: error.message });
    }
};

export const getAllMessages = async(req,res) => {
    try{
        const sender_id = req.user._id;
        const receiver_id = req.params.id;

        const messages = await Message.find({
        $or: [
            { senderId: sender_id, receiverId: receiver_id },
            { senderId: receiver_id, receiverId: sender_id },
        ],
        });
        
        res.status(200).json(messages);
    }
    catch(error){
        console.log("Error in getAllMessages: ",error);
        res.status(500).json({ message: error.message });
    }
};

export const sendMessage = async(req,res) => {
    try{
        const senderId = req.user._id;
        const receiverId = req.params.id;

        const { text, image } = req.body;
        let imageUrl;

        if(image){
            const uploadedImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadedImage.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        await newMessage.save();
        res.status(201).json(newMessage);
    }
    catch(error){
        console.log("Error in sending Message: ",error);
        res.status(500).json({ message: error.message });
    }
};