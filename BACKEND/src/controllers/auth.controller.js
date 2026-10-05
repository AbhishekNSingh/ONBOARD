import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const register = async (req, res) => {
  const { email, password, contact, name } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email:email.toLowerCase() }, { contact }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists" });
    }

    const user = await userModel.create({
      email,
      password,
      contact,
      name
    });

    const token = await jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.status(200).json({
      message: "user registered successfully",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        contact: user.contact,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel
      .findOne({ email: email.toLowerCase() })
      .select("+password");

    // Same message for both cases, so attackers can't tell which part was wrong
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });

    res.status(200).json({
      message: "user logged in successfully",
      success: true,
      user: {
        id: user._id,
        email: user.email,
        contact: user.contact,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMe = async (req,res) => {
  const user = req.user;

  if(!user){
    return res.status(401).json({ message: "Not logged in " })
  }
  return res.status(200).json({
    message:"User fetched successfully",
    success:true,
    user:{
      id: user._id,
      email: user.email,
      contact: user.contact,
      name: user.name,
      role: user.role
    }
  })
}