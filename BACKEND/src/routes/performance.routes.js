import {Router} from "express";
import { authenticateUser, authorize } from "../middlewares/auth.middleware.js";
import {giveRemarks,getMyPerformance} from "../controllers/performance.controller.js"

const router = Router();

router.use(authenticateUser);

router.post("/", authorize("manager"),giveRemarks);
router.get("/my", authorize("employee"), getMyPerformance);



export default router;