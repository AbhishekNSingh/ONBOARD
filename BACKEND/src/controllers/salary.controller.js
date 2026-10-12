import mongoose from "mongoose";

import userModel from "../models/user.model.js";
import salaryModel from "../models/salary.model.js";
import bonusModel from "../models/bonus.model.js";
import advanceModel from "../models/advance.model.js";

const getSalarySummary = async (employee, month) => {
  if (!employee.baseSalary || employee.baseSalary <= 0) {
    throw new Error("SALARY_NOT_SET");
  }

  const salary = await salaryModel.findOneAndUpdate(
    { employee: employee._id, month },
    { $setOnInsert: { baseSalary: employee.baseSalary } },
    { upsert: true, new: true, runValidators: true },
  );

  const bonuses = await bonusModel.find({ employee: employee._id, month });
  const advances = await advanceModel.find({ employee: employee._id, month });

  const bonusTotal = bonuses.reduce((sum, b) => sum + b.amount, 0);
  const advanceTotal = advances.reduce((sum, a) => sum + a.amount, 0);

  const paid = 0;
  const due = salary.baseSalary + bonusTotal - advanceTotal - paid;

  return {
    month,
    baseSalary: salary.baseSalary,
    bonusTotal,
    advanceTotal,
    paid,
    due,
  };
};

export const getMySalary = async (req, res) => {
  try {
    const month = req.query.month || new Date().toISOString().slice(0, 7);

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Month must be YYYY-MM" });
    }
    const monthNumber = Number(month.slice(5, 7));
    if (monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({ message: "Invalid month" });
    }

    const summary = await getSalarySummary(req.user, month);

    return res.status(200).json({
      message: "Salary summary fetched successfully",
      success: true,
      summary,
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


export const getEmployeeSalary = async(req,res) => {

   try {
     if (!mongoose.isValidObjectId(req.params.id)) {
          return res.status(400).json({ message: "Invalid employee id" });
    }

    const month = req.query.month || new Date().toISOString().slice(0, 7);

    if (!/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: "Month must be YYYY-MM" });
    }
    const monthNumber = Number(month.slice(5, 7));
    if (monthNumber < 1 || monthNumber > 12) {
      return res.status(400).json({ message: "Invalid month" });
    }

    const employee = await userModel.findById(req.params.id);

    if(!employee || employee.role !== "employee"){
        return res.status(404).json({
            message:"Employee not found"
        })
    }

    if(!employee.manager || employee.manager.toString() !== req.user._id.toString()){
        return res.status(403).json({
            message:"This employee does not report to you"
        })
    }

    const summary = await getSalarySummary(employee,month);

    return res.status(200).json({
        message:"Salary fetched successfully",
        success:true,
        summary
    })
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


}