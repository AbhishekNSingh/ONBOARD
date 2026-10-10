import Router from "express";

import { authenticateUser, authorize } from "../middlewares/auth.middleware.js";

import {
  getAllUsers,
  updateUserRole,
  assignManager,
  setBaseSalary
} from "../controllers/user.controller.js";

const userRouter = Router();


userRouter.use(authenticateUser, authorize("admin"));

userRouter.get("/", getAllUsers);

userRouter.patch("/:id/role", updateUserRole);

userRouter.patch("/:id/manager", assignManager);
userRouter.patch("/:id/salary", setBaseSalary);


export default userRouter;
