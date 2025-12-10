import mongoose, { Schema } from "mongoose";

const TeacherSchema = Schema(
  {
    teacherId: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "teacher",
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "TeacherDB", timestamp: true }
);
export default mongoose.models.Teacher ||
  mongoose.model("Teacher", TeacherSchema);
