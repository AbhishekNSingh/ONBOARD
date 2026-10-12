import mongoose from "mongoose";

const salarySchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required:true
    },
    month: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"],
    },
    baseSalary: {
      type: Number,
      required: true,
      min: [1, "Amount must be greater than 0"],
    },
  },
  { timestamps: true },
);
salarySchema.index({ employee: 1, month: 1 }, { unique: true });

const salaryModel = mongoose.model("salary", salarySchema);
export default salaryModel;
