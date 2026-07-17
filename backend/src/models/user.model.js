import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  deviceType: { type: String, default: "desktop" },
  deviceName: { type: String },
  browser: { type: String },
  os: { type: String },
  ipAddress: { type: String },
  lastActive: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    publicKey: {
      type: String,
      required: true,
      default: "",
    },
    contacts: {
      type: Array,
      default: [],
    },
    devices: {
      type: [deviceSchema],
      default: [],
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
