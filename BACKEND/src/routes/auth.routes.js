import { Router } from "express";
import {
  validateLoginUser,
  validateUserInput,
} from "../validators/auth.validator.js";
import { register, login,logOut, getMe } from "../controllers/auth.controller.js";
import { authenticateUser} from "../middlewares/auth.middleware.js";

import rateLimit from "express-rate-limit";
const authRouter = Router();
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts, try again later" },
});

authRouter.post("/register", authLimiter, validateUserInput, register);
authRouter.post("/login", authLimiter, validateLoginUser, login);
authRouter.post("/logout",logOut)
authRouter.get("/me", authenticateUser, getMe);

// temporary route to test admin authorization
// authRouter.get(
//   "/admin-only",
//   authenticateUser,
//   authorize("admin"),
//   (req, res) => {
//     res.json({ message: `Hello admin ${req.user.name}` });
//   },
// );

export default authRouter;
