import attendanceModel from "../models/attendance.model.js";
import userModel from "../models/user.model.js";

export const getMyTeam = async (req, res) => {
  try {
    const team = await userModel
      .find({ manager: req.user.id })
      .select("name email contact");

    return res.status(200).json({
      message: "Team fetched successfully",
      success: true,
      team,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const markAttendance = async (req, res) => {
  try {
    const { employeeId, date, status } = req.body;

    const employee = await userModel.findById(employeeId);
    if (!employee) {
      return res.status(404).json({
        message: "Employee is invalid",
      });
    }
    if (!employee.manager || employee.manager.toString() !== req.user.id) {
      return res.status(403).json({
        message: "This employee does not report to you",
      });
    }

    if (!["present", "absent", "leave"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (!date || isNaN(new Date(date))) {
      return res.status(400).json({
        message: "Not a valid date",
      });
    }

    if (date > new Date().toISOString().slice(0, 10)) {
      return res
        .status(400)
        .json({ message: "Cannot mark attendance for a future date" });
    }

    const record = await attendanceModel.findOneAndUpdate(
      { employee: employee._id, date },
      { status, markedBy: req.user.id },
      { upsert: true, new: true, runValidators: true },
    );

    return res.status(200).json({
      message: "Attendance marked successfully",
      success: true,
      record,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getMyAttendance = async (req, res) => {
  try {
    const records = await attendanceModel
      .find({ employee: req.user._id })
      .select("date status")
      // .populate("markedBy", "name")
      .sort({ date: -1 });

    return res.status(200).json({
      message: "Records fetched successfully",
      success: true,
      records,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getEmployeeAttendance = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const employee = await userModel.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({
        message: "Is not a valid employee",
      });
    }

    if (!employee.manager || employee.manager.toString() !== req.user.id) {
      return res.status(403).json({
        message: "This employee is not reporting to you",
      });
    }

    const filter = { employee: employee._id };
    const { month } = req.query;

    if (month) {
      if (!/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ message: "Month must be YYYY-MM" });
      }
      filter.date = { $regex: "^" + month };
    }

    const records = await attendanceModel
      .find(filter)
      .select("date status")
      .sort({ date: -1 });
    return res.status(200).json({
      message: `Records of ${employee.name} is fetched successfully `,
      success: true,
      records,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
};
