import mongoose from "mongoose";

const advanceSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required:true
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


const advanceModel = mongoose.model("advance",advanceSchema);
export default advanceModel;