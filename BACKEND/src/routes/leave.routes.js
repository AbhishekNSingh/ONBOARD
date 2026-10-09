import { Router } from "express";
const router = Router();
import { authenticateUser,authorize } from "../middlewares/auth.middleware.js";
import {createLeave,leaveDecision,getPendingLeaves,getMyLeaves} from "../controllers/leave.controller.js"

router.use(authenticateUser)
router.post("/",authorize("manager","employee"),createLeave)
router.patch("/:id/decision",authorize("manager","admin"),leaveDecision)
router.get("/pending", authorize("manager", "admin"), getPendingLeaves);
router.get("/my",authorize("manager","employee"),getMyLeaves)

export default router;