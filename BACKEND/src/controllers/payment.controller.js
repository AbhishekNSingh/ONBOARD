import mongoose from "mongoose";
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
