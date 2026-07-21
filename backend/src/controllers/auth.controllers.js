import bcrypt from "bcrypt";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
  try {
    const { email, fullName, password, publicKey, devices } = req.body;
    if (!email || !fullName || !password || !publicKey) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must atleast be 6 characters long" });
    }

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      publicKey,
      devices: devices || [],
    });

    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        publicKey: newUser.publicKey,
      });
    } else {
      res.status(400).json({ message: "Invalid User Details" });
    }
  } catch (error) {
    console.log("Error in signup: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid Credentials" });

    generateToken(user._id, res);
    res.status(201).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
      publicKey: user.publicKey,
    });
  } catch (error) {
    console.log("Error in login: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Successful" });
  } catch (error) {
    console.log("Error in the logout: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic)
      return res.status(400).json({ message: "Profile Picture is missing!" });

    const uploadedPic = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadedPic.secure_url },
      { new: true },
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in updatePath: ", error);
    res.status(500).json({ message: error.message });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const addContact = async (req, res) => {
  try {
    const { contact } = req.body;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, { $push: { contacts: contact } });

    res.status(200).json({ message: "Contact added successfully" });
  } catch (error) {
    console.log("Error in addContact controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.status(200).json(user.contacts);
  } catch (error) {
    console.log("Error in getContacts controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { contactId } = req.params;
    const userId = req.user._id;
    await User.findByIdAndUpdate(userId, {
      $pull: { contacts: { _id: contactId } },
    });
    res.status(200).json({ message: "Contact deleted successfully" });
  } catch (error) {
    console.log("Error in deleteContact controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const addDevice = async (req, res) => {
  try {
    const { deviceId, deviceType, deviceName, browser, os, ipAddress } =
      req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const device = user.devices.find((d) => d.deviceId === deviceId);
    if (device) {
      return res.status(400).json({ message: "Device already exists" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          devices: {
            deviceId,
            deviceType,
            deviceName,
            browser,
            os,
            ipAddress,
          },
        },
      },
      { new: true },
    );
    res.status(200).json({ message: "Device added successfully" });
  } catch (error) {
    console.log("Error in addDevice controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getDevices = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    res.status(200).json(user.devices || []);
  } catch (error) {
    console.log("Error in getDevices controller", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const removeDevice = async (req, res) => {
  try {
    const { deviceId } = req.params;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.devices = user.devices.filter(
      (device) => device.deviceId !== deviceId,
    );
    await user.save();

    res
      .status(200)
      .json({ message: "Device removed successfully", devices: user.devices });
  } catch (error) {
    console.error("Error in removeDevice:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
