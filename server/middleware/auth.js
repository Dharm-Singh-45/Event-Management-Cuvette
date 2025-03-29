import UserModel from "../model/userSchema.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async(req,res,next)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({message:"Access denied. No token provided."});
        }
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await UserModel.findById(decode.id).select("-password");
        next()
    } catch (error) {
        return res.status(403).json({ message: "Invalid or expired token." });
    }
}