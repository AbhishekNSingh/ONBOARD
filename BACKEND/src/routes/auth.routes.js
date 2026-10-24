import { Router } from "express";
import rateLimit from "express-rate-limit";
import {
  validateLoginUser,
  validateUserInput,
} from "../validators/auth.validator.js";
import {
  register,
  login,
  googleLogin,
  logOut,
  getMe,
} from "../controllers/auth.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const authRouter = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many attempts, try again later" },
});

authRouter.post("/register", authLimiter, validateUserInput, register);
authRouter.post("/login", authLimiter, validateLoginUser, login);
authRouter.post("/google", authLimiter, googleLogin);
authRouter.post("/logout", logOut);
authRouter.get("/me", authenticateUser, getMe);

export default authRouter;