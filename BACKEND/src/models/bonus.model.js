import mongoose from "mongoose";

const bonusSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    givenBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: [1, "Amount must be greater than 0"],
    },
    reason: {
      type: String,
      required: true,
      trim: true,
    },
    month: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}$/, "Month must be in YYYY-MM format"],
    },
  },
  { timestamps: true },
);

const bonusModel = mongoose.model("bonus", bonusSchema);
export default bonusModel;
