import { Router } from "express";
import { authenticateUser, authorize } from "../middlewares/auth.middleware.js";
import { giveBonus, getMyBonuses } from "../controllers/bonus.controller.js";

const router = Router();

router.use(authenticateUser);
router.post("/", authorize("manager"), giveBonus);
router.get("/my", authorize("employee"), getMyBonuses);

export default router;
