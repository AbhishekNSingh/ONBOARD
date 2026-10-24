import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    // Google users have no password, so it's only required when there's no googleId
    password: {
      type: String,
      select: false,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: { type: String, unique: true, sparse: true },
    picture: { type: String },
    contact: { type: String, required: false },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "manager", "employee"],
      default: "employee",
    },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    baseSalary: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);
export default userModel;