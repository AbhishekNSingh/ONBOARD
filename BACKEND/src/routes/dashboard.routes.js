import { Router } from "express";
import { authenticateUser, authorize } from "../middlewares/auth.middleware.js";
import {getEmployeeDashboard,getManagerDashboard,getAdminDashboard} from "../controllers/dashboard.controller.js"


const router = Router();

router.use(authenticateUser);
router.get("/employee", authorize("employee"), getEmployeeDashboard);
router.get("/manager", authorize("manager"), getManagerDashboard);
router.get("/admin", authorize("admin"), getAdminDashboard);

export default router;