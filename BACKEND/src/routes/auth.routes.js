import { Router } from "express";
import { validateLoginUser,validateUserInput } from "../validators/auth.validator.js";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { authenticateUser,authorize } from "../middlewares/auth.middleware.js";
const authRouter = Router();

authRouter.post("/register", validateUserInput, register);
authRouter.post("/login", validateLoginUser, login);
authRouter.get("/me",authenticateUser ,getMe);


// temporary route to test admin authorization
authRouter.get("/admin-only", authenticateUser, authorize("admin"), (req, res) => {
  res.json({ message: `Hello admin ${req.user.name}` });
});



export default authRouter;
