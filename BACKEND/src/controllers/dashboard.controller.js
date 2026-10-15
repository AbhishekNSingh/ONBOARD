import leaveModel from "../models/leave.model.js";
import userModel from "../models/user.model.js";
import paymentModel from "../models/payment.model.js";
import performanceModel from "../models/performance.model.js";
import { getSalarySummary } from "./salary.controller.js";

export const getEmployeeDashboard = async (req, res) => {
  try {
    const now = new Date().toISOString();
    const month = now.slice(0, 7);
    const year = now.slice(0, 4);

    let salary = null;

    try {
      salary = await getSalarySummary(req.user, month);
    } catch (err) {
      if (err.message !== "SALARY_NOT_SET") throw err;
    }

    const [pendingLeaves, approvedLeaves, latestRating] = await Promise.all([
      leaveModel.countDocuments({ requester: req.user._id, status: "pending" }),
      leaveModel.find({
        requester: req.user._id,
        status: "approved",
        fromDate: { $regex: "^" + year },
      }),
      performanceModel
        .findOne({ employee: req.user._id })
        .sort({ createdAt: -1 })
        .select("rating month remarks"),
    ]);



     const leavesTaken = approvedLeaves.reduce((sum, l) => {
      const days = (new Date(l.toDate) - new Date(l.fromDate)) / 86400000 + 1;
      return sum + days;
    }, 0);

    return res.status(200).json({
      message: "Dashboard fetched successfully",
      success: true,
      summary: {
        month,
        salary,
        leavesTaken,
        pendingLeaves,
        latestRating, 
      }})

    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getManagerDashboard = async (req, res) => {
  try {
    const month = new Date().toISOString().slice(0, 7);

    const [teamSize, pendingLeaves, payments] = await Promise.all([
      userModel.countDocuments({ manager: req.user._id }),
      leaveModel.countDocuments({ status: "pending", manager: req.user._id }),
      paymentModel.find({ paidBy: req.user._id, month, status: "paid" }),
    ]);

    const paidThisMonth = payments.reduce((sum, p) => sum + p.amount, 0);

    return res.status(200).json({
      message: "Dashboard fetched successfully",
      success: true,
      summary: { teamSize, pendingLeaves, paidThisMonth },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const [totalUsers, managers, employees, pendingLeaves] = await Promise.all([
      userModel.countDocuments(),
      userModel.countDocuments({ role: "manager" }),
      userModel.countDocuments({ role: "employee" }),
      leaveModel.countDocuments({ status: "pending", approverRole: "admin" }),
    ]);

    return res.status(200).json({
      message: "Dashboard fetched successfully",
      success: true,
      summary: { totalUsers, managers, employees, pendingLeaves },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
