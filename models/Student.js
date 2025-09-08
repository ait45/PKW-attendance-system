import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    Class: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      required: true,
    },
    parentPhone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Active", "Idle"],
      required: true,
      default: "Active",
    },
    role: {
      type: String,
      required: true,
      default: "student",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    }
  },
  { collection: "ClientDB", timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", UserSchema);
