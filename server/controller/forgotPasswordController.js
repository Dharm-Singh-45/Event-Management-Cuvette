import jwt from 'jsonwebtoken';
import UserModel from '../model/userSchema.js';
import nodemailer from 'nodemailer';

export const forgotPasswordController = async(req,res)=>{
    const {email} = req.body;
    if(!email){
        return res.status(400).json({message:"Email is required"})
    }
    try {
        const user = await UserModel.findOne({email});
        if(!user){
            return res.status(400).json({message:"User does not exist"})
        }

        const resetToken = jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"10m"}) ;

        // send email 
        const transporter = nodemailer.createTransport({
            service:"gmail",
            auth:{
                user:process.env.EMAIL_USER,
                pass:process.env.EMAIL_PASS   
            }
        })
        const resetLink = `http://localhost:5000/api/resetpassword/${resetToken}`

        await transporter.sendMail({
            from:process.env.EMAIL_USER,
            to:user.email,
            subject:"Password Reset Request",
            text:`<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        })
        res.status(200).json({ message: "Reset link sent to your email" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}