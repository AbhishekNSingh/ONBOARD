import mongoose from "mongoose";
import crypto from "crypto";
import { razorpay } from "../utils/razorpay.js";
import { config } from "../config/config.js";
import userModel from "../models/user.model.js";
import paymentModel from "../models/payment.model.js";
import { getSalarySummary } from "./salary.controller.js";

export const makePayment = async (req, res) => {
  try {
    const { employeeId, month, amount, note } = req.body;
    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({ message: "Invalid employee id" });
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Amount must be a number greater than zero",
      });
    }

    if (typeof month !== "string" || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Month must be YYYY-MM" });
    }
    const monthNumber = Number(month.slice(5, 7));
    if (monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({ message: "Invalid month" });
    }

    const employee = await userModel.findById(employeeId);
    if (!employee || employee.role !== "employee") {
      return res.status(404).json({
        message: "Not a valid employee",
      });
    }
    if (
      !employee.manager ||
      employee.manager.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "This employee does not report to you",
      });
    }

    const summary = await getSalarySummary(employee, month);

    if (amount > summary.due) {
      return res.status(400).json({
        message:
          "Amount is more than the due. Record a bonus or advance first.",
      });
    }

    const payment = await paymentModel.create({
      employee: employee._id,
      paidBy: req.user._id,
      amount,
      month,
      status: "paid", // Stage 1: no gateway yet
      note: typeof note === "string" ? note.trim() : undefined,
    });

    return res.status(201).json({
      message: "Payment made",
      success: true,
      payment,
    });
  } catch (error) {
    if (error.message === "SALARY_NOT_SET") {
      return res
        .status(400)
        .json({ message: "Salary not set for this employee" });
    }
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const filter = { employee: req.user._id };
    const { month } = req.query;

    if (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ message: "Month must be YYYY-MM" });
      }
      const monthNumber = Number(month.slice(5, 7));
      if (monthNumber < 1 || monthNumber > 12) {
        return res.status(400).json({ message: "Invalid month" });
      }

      filter.month = month;
    }

    const payments = await paymentModel
      .find(filter)
      .populate("paidBy", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Payments fetched successfully",
      success: true,
      payments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getEmployeePayments = async (req, res) => {
  try {
    const employeeId = req.params.id;

    const filter = { employee: employeeId };

    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({ message: "Invalid employee id" });
    }

    const { month } = req.query;
    if (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ message: "Month must be YYYY-MM" });
      }
      const monthNumber = Number(month.slice(5, 7));
      if (monthNumber < 1 || monthNumber > 12) {
        return res.status(400).json({ message: "Invalid month" });
      }

      filter.month = req.query.month;
    }

    const employee = await userModel.findById(req.params.id);

    if (!employee || employee.role !== "employee") {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    if (
      !employee.manager ||
      employee.manager.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "This employee does not report to you",
      });
    }

    const payments = await paymentModel
      .find(filter)
      .populate("paidBy", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: `Payments detail of ${employee.name} fetched successfully`,
      success: true,
      payments,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};


// Step 1: check the payment is allowed, create a Razorpay order, save it as "pending"
export const createPaymentOrder = async (req, res) => {
  try {
    const { employeeId, month, amount, note } = req.body;

    // same checks as makePayment
    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({ message: "Invalid employee id" });
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({ message: "Amount must be a number greater than zero" });
    }
    if (typeof month !== "string" || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Month must be YYYY-MM" });
    }
    const monthNumber = Number(month.slice(5, 7));
    if (monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({ message: "Invalid month" });
    }

    const employee = await userModel.findById(employeeId);
    if (!employee || employee.role !== "employee") {
      return res.status(404).json({ message: "Employee not found" });
    }
    if (!employee.manager || employee.manager.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "This employee does not report to you" });
    }

    const summary = await getSalarySummary(employee, month);
    if (amount > summary.due) {
      return res.status(400).json({
        message: "Amount is more than the due. Record a bonus or advance first.",
      });
    }

    // Razorpay counts in paise, so rupees × 100, as a whole number
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `pay_${Date.now()}`,
      notes: { employeeId: String(employee._id), month },
    });

    await paymentModel.create({
      employee: employee._id,
      paidBy: req.user._id,
      amount,
      month,
      status: "pending", // does NOT reduce the due until it is verified
      razorpayOrderId: order.id,
      note: typeof note === "string" ? note.trim() : undefined,
    });

    return res.status(201).json({
      message: "Order created",
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: config.RAZORPAY_KEY_ID, // the public key, safe to send
    });
  } catch (error) {
    if (error.message === "SALARY_NOT_SET") {
      return res.status(400).json({ message: "Salary not set for this employee" });
    }
    console.log(error);
    // Razorpay's own errors carry a statusCode
    if (error.statusCode) {
      return res.status(502).json({ message: "Couldn't start the payment. Try again." });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// Step 2: check the proof the Razorpay window sent back, then mark the payment "paid"
export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (
      [razorpay_order_id, razorpay_payment_id, razorpay_signature].some(
        (value) => typeof value !== "string" || !value
      )
    ) {
      return res.status(400).json({ message: "Missing payment details" });
    }

    // only the manager who started this order can finish it
    const payment = await paymentModel.findOne({
      razorpayOrderId: razorpay_order_id,
      paidBy: req.user._id,
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    if (payment.status === "paid") {
      return res.status(200).json({ message: "Payment already recorded", success: true });
    }
    if (payment.status !== "pending") {
      return res.status(400).json({ message: "This payment is no longer open" });
    }

    // recompute the signature with our secret and compare
    const expected = crypto
      .createHmac("sha256", config.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const valid =
      expected.length === razorpay_signature.length &&
      crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(razorpay_signature));

    if (!valid) {
      payment.status = "failed";
      await payment.save();
      return res.status(400).json({ message: "Payment could not be verified" });
    }

    // check the due again: another payment may have been made while this one was open
    const employee = await userModel.findById(payment.employee);
    const summary = await getSalarySummary(employee, payment.month);
    if (payment.amount > summary.due) {
      payment.status = "failed";
      await payment.save();
      return res.status(409).json({
        message:
          "The amount is now more than what is due, so it wasn't recorded. Refund it from the Razorpay dashboard.",
      });
    }

    payment.status = "paid";
    payment.razorpayPaymentId = razorpay_payment_id;
    await payment.save();

    return res.status(200).json({
      message: "Payment successful",
      success: true,
      payment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "This payment was already used" });
    }
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// the manager closed the Razorpay window without paying
export const cancelPaymentOrder = async (req, res) => {
  try {
    const { razorpay_order_id } = req.body;
    if (typeof razorpay_order_id !== "string" || !razorpay_order_id) {
      return res.status(400).json({ message: "Missing order id" });
    }

    await paymentModel.updateOne(
      { razorpayOrderId: razorpay_order_id, paidBy: req.user._id, status: "pending" },
      { status: "failed" }
    );

    return res.status(200).json({ message: "Payment cancelled", success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};