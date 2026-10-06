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

export const markAttendance = async(req,res) => {
    
}