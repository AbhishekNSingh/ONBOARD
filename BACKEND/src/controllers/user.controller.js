import userModel from "../models/user.model.js";
import mongoose from "mongoose";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel
      .find()
      .select("-password")
      .populate("manager", "name email")
      .sort({ createdAt: -1 });
    res.json({
      message: "Users fetched successfully",
      success: true,
      users,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "manager", "employee"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (req.params.id === req.user.id.toString()) {
      return res
        .status(400)
        .json({ message: "You cannot change role of yourself" });
    }

    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "manager" && role !== "manager") {
      await userModel.updateMany(
        { manager: user._id },
        { $unset: { manager: 1 } },
      );
    }

    user.role = role;
    if (role !== "employee") user.manager = undefined;

    await user.save();
    return res.status(200).json({
      message: `${user.name} is now a ${role}`,
      user: { id: user._id, name: user.name, role: user.role },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const assignManager = async (req, res) => {
  try {
    const { managerId } = req.body;

    const employee = await userModel.findById(req.params.id);
    if (!employee || employee.role !== "employee") {
      return res
        .status(400)
        .json({ message: "only employee can be assigned to some manager" });
    }

    const manager = await userModel.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return res.status(400).json({ message: "User is not a manager" });
    }

    employee.manager = manager._id;
    await employee.save();

    return res
      .status(200)
      .json({ message: `${employee.name} will now report to ${manager.name}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const setBaseSalary = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const { baseSalary } = req.body;
    if (!Number.isFinite(baseSalary) || baseSalary < 0) {
      return res
        .status(400)
        .json({ message: "Salary must be a number, 0 or more" });
    }

    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.role === "admin") {
      return res.status(400).json({
        message: "Admin does not have a salary",
      });
    }

    user.baseSalary = baseSalary;
    await user.save();
    return res.status(200).json({
      message: "user baseSalary is updated successfully",
      success: true,
      user: {
        id: user._id,
        name: user.name,
        baseSalary: user.baseSalary,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};
