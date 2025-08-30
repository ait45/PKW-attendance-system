import mongoose, { Schema } from "mongoose";

const Attendance = Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    Class: {
      type: String,
      required: true,
    },
    grade: {
      type: String,
      required: true,
    },
  },
  {
    collection: "LineupAttendance",
    timestamps: true,
  }
);
export default mongoose.models.LineupAttendance ||
  mongoose.model("LineupAttendance", Attendance);
