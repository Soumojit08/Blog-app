import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/utils.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const signupRoute = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      res.status(400).json({ message: "All fields required" });
    }
    if (password.length < 6) {
      res.status(400).json({ message: "Password Must be 6 Characters" });
    }
    const user = await User.findOne({ email });

    if (user) {
      res.status(400).json({ message: "email already exists" });
    }

    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      fullName,
      email,
      password: hashPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({ newUser, message: "Created Successfully" });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log(`error : ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginRoute = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.status(400).json({ message: "Invalid email or password" });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      res.status(400).json({ message: "Invalid email or password" });
    }

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log(`error : ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logoutRoute = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Successfully" });
  } catch (error) {
    console.log(`error : ${error.message}`);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkRoute = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, bio, links } = req.body;
    const userId = req.user.id;

    // Check if email is already taken (if email is being changed)
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: userId } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...(fullName && { fullName }),
        ...(email && { email }),
        ...(bio && { bio }),
        ...(links && { links }),
      },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
};

export const updateProfilePhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    // Delete old profile photo if it exists
    if (user.profilePhoto) {
      try {
        const oldPhotoPath = path.join(__dirname, "../../", user.profilePhoto);
        await fs.unlink(oldPhotoPath);
      } catch (error) {
        console.error("Error deleting old photo:", error);
        // Continue execution even if old photo deletion fails
      }
    }

    // Store relative path in database
    const photoPath = `/uploads/profile-photos/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: photoPath },
      { new: true }
    ).select("-password");

    res.json(updatedUser);
  } catch (error) {
    console.error("Profile photo update error:", error);
    res.status(500).json({ message: "Error updating profile photo" });
  }
};
