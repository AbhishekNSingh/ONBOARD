import { Router } from "express";
import { authenticateUser, authorize } from "../middlewares/auth.middleware.js";
import {
  makePayment,
  getMyPayments,
  getEmployeePayments,
} from "../controllers/payment.controller.js";

const router = Router();

router.use(authenticateUser);

router.post("/", authorize("manager"), makePayment);
router.get("/my", authorize("employee"), getMyPayments);
router.get("/employee/:id", authorize("manager"), getEmployeePayments);

export default router;
