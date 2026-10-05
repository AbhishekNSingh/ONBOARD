import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import {config} from "../config/config.js";



export const authenticateUser = async (req,res,next) => {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if(!token){
        return res.status(401).json({message : "Unauthorized access"});
    }
    try{
        const decoded = await jwt.verify(token,config.JWT_SECRET);
        const user = await userModel.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({message : "Unauthorized access"});
        }

        req.user = user;
        next();
    }
    catch(err){
        console.log(err);
        return res.status(401).json({message : "Unauthorized"})
    }
}

export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: "You don't have permission" });
  }
  next();
};