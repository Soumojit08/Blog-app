import User from "../models/user.model.js";

export const searchUser = async (req, res) => {
  const { name } = req.query;

   // Validate the name parameter
   if (!name || typeof name !== 'string') {
    return res.status(400).json({ message: "Name query parameter must be a non-empty string." });
  }

  try {
    const users = await User.find({
      fullName: { $regex: name, $options: "i" },
    }).select("fullName email profilePhoto");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);
    res
      .status(500)
      .json({ message: "Internal server error in searchUser" + error });
  }
};

export const followUser = async (req, res) => {
  const { userId } = req.params; // Get the user ID from the URL
  const currentUserId = req.user._id; // Get the current user's ID from the request

  try {
    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the current user to the followed user's followers list
    userToFollow.followers.push(currentUserId);
    await userToFollow.save();

    res.status(200).json({ message: "Followed successfully" });
  } catch (error) {
    console.error("Error following user:", error);
    res.status(500).json({ message: "Internal server error in followUser" });
  }
};

export const getUserProfile = async (req, res) => {
  const { userId } = req.params; // Get the user ID from the request parameters

  try {
    const user = await User.findById(userId).select("fullName profilePhoto bio"); // Adjust fields as necessary
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Internal server error in getUserProfile" });
  }
};