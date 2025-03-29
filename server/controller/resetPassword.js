import UserModel from "../model/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const resetpassword = async (req, res) => {
    try {
        const {token } = req.params;
        const {password} = req.body;
        if(!password){
            return res.status(400).json({message:"Password is required"})
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        const user = await UserModel.findById(decode.id);
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }
        // update password 
        const hashedPassword = await bcrypt.hash(password,10);
        await user.updateOne({$set:{password:hashedPassword}});
        res.status(200).json({message:"Password updated successfully"})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}