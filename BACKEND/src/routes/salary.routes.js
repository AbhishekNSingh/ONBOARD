import {Router} from "express";
const router = Router();

import {authorize,authenticateUser} from "../middlewares/auth.middleware.js" 
import {getMySalary,getEmployeeSalary   } from "../controllers/salary.controller.js"

router.use(authenticateUser);



router.get("/my",authorize("employee"),getMySalary)
router.get("/employee/:id",authorize("manager"),getEmployeeSalary)


export default router;