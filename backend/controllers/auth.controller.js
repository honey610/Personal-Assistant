import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Auth from "../models/auth.model.js";
import dotenv from "dotenv";
dotenv.config();


const JWT_SECRET = process.env.JWT_SECRET;



export const login=async(req,res)=>{
    try{
        const {password,email}=req.body;
        if(!email||!password){
            return res.status(400).json({message:"all fields are required"})
        }
        const user=await Auth.findOne({email})
        if(!user){
            return res.status(400).json({message:"user not found"})
        }
        const isMatch=await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"invalid credentials"})
        }
       const token =jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:"1h"})
       return res.status(200).json({token})
       


    }catch(err){
        return res.status(500).json({message:err.message})

    }
}

export const  register=async(req,res)=>{
    try{
        const{username,email,password}=req.body;
        if(!username||!email||!password){
            return res.status(400).json({message:"all fields are required"})
        }
        const existingUser=await Auth.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"user already exists"})


        }
        const hashedPassword=await bcrypt.hash(password,10)
        const newUser=new Auth({username,email,password:hashedPassword})
        await newUser.save()
        return res.status(201).json({message:"user registered successfully"})


    }catch(err){
        return res.status(500).json({message:err.message})

    }
}

