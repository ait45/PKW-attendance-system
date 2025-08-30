import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
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
    grade: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    parentPhone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      default: "student",
    },
  },
  { collection: "ClientDB", timestamps: true }
);

export default mongoose.models.Student || mongoose.model("Student", UserSchema);
