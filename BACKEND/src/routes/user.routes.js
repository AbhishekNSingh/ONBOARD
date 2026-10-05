import Router from "express";
import { authenticateUser,authorize } from "../middlewares/auth.middleware.js";
import {getAllUsers,updateUserRole} from "../controllers/user.controller.js"
const userRouter = Router();

userRouter.use(authenticateUser,authorize("admin"));

userRouter.get("/",getAllUsers);
userRouter.patch("/:id/role",updateUserRole)


export default userRouter;