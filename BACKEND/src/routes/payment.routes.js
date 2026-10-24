import { Router } from "express";
import { authenticateUser, authorize } from "../middlewares/auth.middleware.js";
import {
  makePayment,
  getMyPayments,
  getEmployeePayments,
  createPaymentOrder,
  verifyPayment,
  cancelPaymentOrder,
} from "../controllers/payment.controller.js";

const router = Router();

router.use(authenticateUser);

router.post("/", authorize("manager"), makePayment);
router.post("/order", authorize("manager"), createPaymentOrder);
router.post("/verify", authorize("manager"), verifyPayment);
router.post("/cancel", authorize("manager"), cancelPaymentOrder);
router.get("/my", authorize("employee"), getMyPayments);
router.get("/employee/:id", authorize("manager"), getEmployeePayments);

export default router;
