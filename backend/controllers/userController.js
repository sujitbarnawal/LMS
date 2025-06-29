import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

//signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please fill in all fields", success: false });
    }
    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email already existas", success: false });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    res
      .status(201)
      .json({ message: "User created successfully", success: true });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//login
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res
        .status(400)
        .json({ message: "Please fill in all fields", success: false });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid password", success: false });
    }
    if (role !== user.role) {
      return res.status(400).json({ message: "Invalid role", success: false });
    }
    //jwt
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    user.password = undefined;
    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "development" ? "strict" : "None",
        maxAge: 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
      })
      .json({ message: `Welcome ${user.name}`, success: true, user });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};

//edit profile
export const editProfile = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.id;
    const file = req.file;

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(400)
        .json({ message: "User not found", success: false });
    }

    let photoUrl = user.photoUrl;

    // Upload to Cloudinary if a file was uploaded
    if (file) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "user_profiles",
      });
      photoUrl = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name: name || user.name,
        photoUrl,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Edit profile error:", error.message);
    return res.status(500).json({ message: error.message, success: false });
  }
};
