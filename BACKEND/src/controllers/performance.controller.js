import mongoose from "mongoose";
import userModel from "../models/user.model.js";
import performanceModel from "../models/performance.model.js";

export const giveRemarks = async (req, res) => {
  try {
    const { employeeId, rating, remarks, month } = req.body;

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be a whole number from 1 to 5" });
    }
    if (typeof remarks !== "string" || !remarks.trim()) {
      return res.status(400).json({ message: "Remarks are required" });
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

    const performance = await performanceModel.create({
      employee: employee._id,
      givenBy: req.user._id,
      rating,
      remarks: remarks.trim(),
      month,
    });

    return res.status(201).json({
      message: "performance given successfully",
      success: true,
      performance,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({
          message: "You have already rated this employee for this month",
        });
    }
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMyPerformance = async (req, res) => {
  try {
    const filter = { employee: req.user._id };
    const { month } = req.query;

    if (month) {
      
      if (typeof month !== "string" || !/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({
          message: "Month must be YYYY-MM",
        });
      }
      const monthNumber = Number(month.slice(5, 7));
      if (monthNumber < 1 || monthNumber > 12) {
        return res.status(400).json({ message: "Invalid month" });
      }
      filter.month = month;
    }

    const performances = await performanceModel
      .find(filter)
      .populate("givenBy", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "performance fetched successfully",
      success: true,
      performances,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};
