import { Router } from "express";
const router = Router();
import { authenticateUser,authorize } from "../middlewares/auth.middleware.js";
import {createLeave,leaveDecision,getPendingLeaves,getMyLeaves,getLeavesTaken} from "../controllers/leave.controller.js"

router.use(authenticateUser)
router.post("/",authorize("manager","employee"),createLeave)
router.get("/pending", authorize("manager", "admin"), getPendingLeaves);
router.get("/my",authorize("manager","employee"),getMyLeaves)
router.get("/taken",authorize("manager","employee"),getLeavesTaken)
router.patch("/:id/decision",authorize("manager","admin"),leaveDecision)

export default router;