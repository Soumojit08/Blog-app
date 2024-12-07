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
