import UserModel from '../model/userSchema.js';

const getSingleUser = async (req, res) => {
    try {
        const userId = req.user.id; 

        const user = await UserModel.findById(userId).select("-password"); 

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default getSingleUser
