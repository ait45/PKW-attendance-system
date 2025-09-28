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

    classes: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    parentPhone: {
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
    },
    plantData: {
      type: String,
      required: true,
    },
    behaviorScore: {
      type: Number,
      required: true,
      default: 100,
    },
    comeDays: {
      type: Number,
      required: true,
      default: 0,
    },
    leaveDays: {
      type: Number,
      required: true,
      default: 0,
    },
    absentDays: {
      type: Number,
      required: true,
      default: 0,
    },
    lateDays: {
      type: Number,
      requried: true,
      default: 0,
    },
    Number: {
      type: Number,
      requried : true,
    }
  },
  { collection: "ClientDB", timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", UserSchema);
