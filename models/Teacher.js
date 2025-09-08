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
    department: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    }
  },
  { collection: "TeacherDB", Timestamp: true }
);
export default mongoose.models.Teacher ||
  mongoose.model("Teacher", TeacherSchema);
