import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import userModel from "../models/user.model.js";
import { config } from "../config/config.js";

const googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

// one place that creates the token and sets the login cookie
const sendLogin = (res, user, status, message) => {
  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "7d" });

  res.cookie("token", token, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

  return res.status(status).json({
    message,
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

export const register = async (req, res) => {
  const { email, password, contact, name } = req.body;

  try {
    const existingUser = await userModel.findOne({
      $or: [{ email: email.toLowerCase() }, { contact }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email or contact already exists" });
    }

    // role is never read from the request, so everyone starts as an employee
    const user = await userModel.create({ email, password, contact, name });

    return sendLogin(res, user, 201, "user registered successfully");
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

    // a Google-only account has no password, so it can't match here
    if (!user || !user.password || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    return sendLogin(res, user, 200, "user logged in successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    if (typeof credential !== "string" || !credential) {
      return res.status(400).json({ message: "Missing Google credential" });
    }

    // Google's library checks the signature, the expiry, and that the token was made for OUR app
    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: config.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch {
      return res.status(401).json({ message: "Google sign-in failed. Try again." });
    }

    if (!payload?.email || !payload.email_verified) {
      return res.status(401).json({ message: "Your Google email isn't verified" });
    }

    const email = payload.email.toLowerCase();

    let user = await userModel.findOne({
      $or: [{ googleId: payload.sub }, { email }],
    });

    if (!user) {
      // first time here: create an employee. The role is never taken from the request
      user = await userModel.create({
        name: payload.name || email.split("@")[0],
        email,
        googleId: payload.sub,
        picture: payload.picture,
      });
    } else if (!user.googleId) {
      // the email already has an account made with a password: link Google to it
      user.googleId = payload.sub;
      if (!user.picture) user.picture = payload.picture;
      await user.save();
    } else if (user.googleId !== payload.sub) {
      return res.status(400).json({ message: "This email is linked to another Google account" });
    }

    return sendLogin(res, user, 200, "user logged in successfully");
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logOut = async (req, res) => {
  res.clearCookie("token", cookieOptions);
  return res.status(200).json({ message: "Logged out", success: true });
};

export const getMe = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  return res.status(200).json({
    message: "User fetched successfully",
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