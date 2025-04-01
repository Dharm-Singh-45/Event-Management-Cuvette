import UserModel from "../model/userSchema.js";
import bcrypt from 'bcryptjs'


const updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const userId = req.user.id; 
   
    let user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    if(password){
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@!,-]).{8,}$/;
      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must contain at least one uppercase letter, one number, one special character (@,!,-) and be at least 8 characters long",
        });
      }
    }
   
  
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export default updateUserProfile