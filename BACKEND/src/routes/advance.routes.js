import { Router } from "express";
import { giveAdvance, getMyAdvances } from "../controllers/advance.controller.js";
import { authenticateUser, authorize } from "../middlewares/auth.middleware.js";
const router = Router();


router.use(authenticateUser);


router.post("/",authorize("manager"),giveAdvance);
router.get("/my",authorize("employee"),getMyAdvances)



export default router;
