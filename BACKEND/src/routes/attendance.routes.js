import { Router } from "express";
const router = Router();
import { authenticateUser, authorize } from "../middlewares/auth.middleware.js";
import {
  getMyTeam,
  markAttendance,
} from "../controllers/attendance.controller.js";

router.use(authenticateUser, authorize("manager"));

router.get("/team", getMyTeam);
router.post("", markAttendance);

export default router;
