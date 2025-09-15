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
    classes: {
      type: String,
      required: true,
    },
    status : {
      type: String,
      required: true,
      default: "ยังไม่เช็คชื่อ",
    }
  },
  {
    collection: "LineupAttendance",
    timestamps: true,
  }
);
export default mongoose.models.LineupAttendance ||
  mongoose.model("LineupAttendance", Attendance);
