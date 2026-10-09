import leaveModel from "../models/leave.model.js";

export const createLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason } = req.body;

    let approverRole;
    let managerId;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        message: "Please provide fromDate and toDate",
      });
    }

    const today = new Date().toISOString().slice(0, 10);

    if (isNaN(new Date(fromDate)) || isNaN(new Date(toDate))) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    if (toDate < fromDate) {
      return res.status(400).json({
        message: "End date cannot be before start date",
      });
    }
    if (today > fromDate) {
      return res.status(400).json({
        message: "Start date cannot be in the past",
      });
    }

    if (req.user.role === "employee") {
      if (!req.user.manager) {
        return res.status(400).json({
          message: "You have no assigned manager yet",
        });
      }
      approverRole = "manager";
      managerId = req.user.manager;
    }
    if (req.user.role === "manager") {
      approverRole = "admin";
    }

    const overlap = await leaveModel.findOne({
      requester: req.user._id,
      status: { $in: ["pending", "approved"] },
      fromDate: { $lte: toDate },
      toDate: { $gte: fromDate },
    });
    if (overlap) {
      return res.status(400).json({
        message: "You already have a leave request in this period",
      });
    }
    const leave = await leaveModel.create({
      requester: req.user._id,
      fromDate,
      toDate,
      reason,
      approverRole,
      manager: managerId,
    });

    return res.status(201).json({
      message: "leave request created",
      success: true,
      leave,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const leaveDecision = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "NOT a valid decision",
      });
    }
    const leave = await leaveModel.findById(req.params.id);

    if (!leave) {
      return res.status(404).json({
        message: "No request exist",
      });
    }

    if (leave.status !== "pending") {
      return res.status(400).json({
        message: "Already decided",
      });
    }

    if (leave.approverRole === "manager") {
      if (
        !leave.manager ||
        leave.manager.toString() !== req.user._id.toString()
      ) {
        return res
          .status(403)
          .json({ message: "You are not allowed to decide" });
      }
    } else {
      if (req.user.role !== "admin") {
        return res
          .status(403)
          .json({ message: "You are not allowed to decide" });
      }
    }

    leave.status = status;
    leave.decidedBy = req.user._id;
    leave.decidedAt = new Date();

    await leave.save();

    return res.status(200).json({
      message: `Leave ${status}`,
      success: true,
      leave,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getPendingLeaves = async (req, res) => {
  try {
    const filter = { status: "pending" };

    if (req.user.role === "manager") {
      filter.approverRole = "manager";
      filter.manager = req.user._id;
    } else {
      filter.approverRole = "admin";
    }

    const leaves = await leaveModel
      .find(filter)
      .populate("requester", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "leaves fetched successfully",
      success: true,
      leaves,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await leaveModel
      .find({ requester: req.user.id })
      .populate("decidedBy", "name")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "leaves fetched successfully",
      success: true,
      leaves,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
