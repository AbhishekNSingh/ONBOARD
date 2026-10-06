import userModel from "../models/user.model.js";

// GET /api/users




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