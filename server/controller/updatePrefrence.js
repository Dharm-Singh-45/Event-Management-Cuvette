import UserModel from "../model/userSchema.js";


export const updateUserPreferences = async (req, res) => {
  try {
    const { username, selectedCategory } = req.body;
    const userId = req.params.id;

    const user = await UserModel.findByIdAndUpdate(
      userId,
      { username, selectedCategory },
      { new: true }
    );

    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Failed to update preferences" });
  }
};
