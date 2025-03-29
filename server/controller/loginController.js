import bcrypt from 'bcryptjs';
import UserModel from '../model/userSchema.js';
import jwt from 'jsonwebtoken';

export const loginController = async(req,res)=>{
    try {
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({message:"All fields are required"})
        }
        const user = await UserModel.findOne({email});
        console.log(user)
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }
        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"8h"})
        res.status(200).json({
            message:"User logged in successfully",
            user,
            token
        })
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
    }
}