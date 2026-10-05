import userModel from "../models/user.model.js";

// GET /api/users


// PATCH /api/users/:id/role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["admin", "manager", "employee"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't change your own role" });
    }

    const user = await userModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If a manager is demoted, their employees are left without a manager
    if (user.role === "manager" && role !== "manager") {
      await userModel.updateMany({ manager: user._id }, { $unset: { manager: 1 } });
    }

    user.role = role;
    if (role !== "employee") user.manager = undefined;

    await user.save();
    res.json({ message: `${user.name} is now a ${role}`, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

// PATCH /api/users/:id/manager
export const assignManager = async (req, res) => {
  try {
    const { managerId } = req.body;

    const employee = await userModel.findById(req.params.id);
    if (!employee || employee.role !== "employee") {
      return res.status(400).json({ message: "Target must be an employee" });
    }

    const manager = await userModel.findById(managerId);
    if (!manager || manager.role !== "manager") {
      return res.status(400).json({ message: "Selected user is not a manager" });
    }

    employee.manager = manager._id;
    await employee.save();

    res.json({ message: `${employee.name} now reports to ${manager.name}` });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};