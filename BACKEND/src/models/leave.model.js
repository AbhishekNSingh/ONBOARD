import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    fromDate: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
    },
    toDate: {
      type: String,
      required: true,
      match: [/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"],
    },
    reason: {
      type: String,
      default: "General leave",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    approverRole: {
      type: String,
      enum: ["manager", "admin"],
      required: true,
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    decidedBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "user" },
    decidedAt: { type: Date },
  },
  { timestamps: true },
);

const leaveModel = mongoose.model("leave", leaveSchema);
export default leaveModel;
