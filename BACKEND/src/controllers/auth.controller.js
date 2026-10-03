import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { config } from "../config/config.js";

export const register = async (req, res) => {
  const { email, password, contact, name, isManager } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email }, { contact }],
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
      name,
      role: isManager ? "manager" : "employee",
    });

    const token = await jwt.sign({ id: user._id }, config.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token);
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
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: " user not found" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = await jwt.sign({ id: user._id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
  res.cookie("token", token);
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
};
