import bonusModel from "../models/bonus.model.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";

export const giveBonus = async (req, res) => {
  try {
    const { employeeId, amount, reason, month } = req.body;
    if (!Number.isFinite(amount) || amount <= 0) {
      return res.status(400).json({
        message: "Anount must be a number greater than zero",
      });
    }
    if (!typeof reason == "string" || !reason.trim()) {
      return res.status(400).json({ message: "Reason is required" });
    }

    if (typeof month !== "string" || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({
        message: "Month must be YYYY-MM",
      });
    }
    const monthNumber = Number(month.slice(5, 7));
    if (monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({ message: "Invalid month" });
    }

    if (!mongoose.isValidObjectId(employeeId)) {
      return res.status(400).json({ message: "Invalid employee id" });
    }

    const employee = await userModel.findById(employeeId);

    if (!employee || employee.role !== "employee") {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    if (
      !employee.manager ||
      employee.manager.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "This employee does not report to you" });
    }

    const bonus = await bonusModel.create({
      employee: employee._id,
      givenBy: req.user._id,
      amount,
      reason: reason.trim(),
      month,
    });

    return res.status(201).json({
      message: "Bonus given successfully",
      success: true,
      bonus,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      messsge: "Server error",
    });
  }
};

export const getMyBonuses = async (req, res) => {
  try {
    const filter = { employee: req.user._id };
    const { month } = req.query;

    if (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ message: "Month must be YYYY-MM" });
      }
      filter.month = month;
    }

    const bonuses = await bonusModel
      .find(filter)
      .populate("givenBy", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "bonus fetched successfully",
      success: true,
      bonuses,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
