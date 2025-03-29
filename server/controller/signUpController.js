import UserModel from "../model/userSchema.js";
import bcrypt from "bcryptjs";


export const signUpController = async(req,res)=>{
    const {firstName,lastName,email,password} = req.body;

    if(!firstName || !lastName || !email || !password){
        return res.status(400).json({message:"All fields are required"})
    }

    try {
        const existingUser = await UserModel.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"User already exists"})
        }

        // hash password 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt)

        const user = await UserModel.create({firstName,lastName,email,password:hashedPassword})

        res.status(201).json({message:"User created successfully",user})
    } catch (error) {
        res.status(500).json({message:"Internal server error"})
        
    }
}