import { Router } from "express";
const router = Router();
import { authenticateUser, authorize } from "../middlewares/auth.middleware.js";
import {
  getMyTeam,
  markAttendance,
  getMyAttendance,
  getEmployeeAttendance
} from "../controllers/attendance.controller.js";


router.get("/my", authenticateUser, authorize("employee"), getMyAttendance);


router.use(authenticateUser, authorize("manager"));
router.get("/team", getMyTeam);
router.post("/mark", markAttendance);
router.get("/employee/:id",getEmployeeAttendance)

export default router;
