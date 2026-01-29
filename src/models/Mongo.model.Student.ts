import mongoose, { Model, Schema } from "mongoose";

interface IUser {
  studentId: string;
  name: string;
  password: string;
  status: "Active" | "Idle";
  role: string;
  isAdmin: boolean;
  classes: string;
  phone: string;
  parentPhone: string;
  plantData: string;
  Number: number;
  joinDays: number;
  lateDays: number;
  leaveDays: number;
  absentDays: number;
  behaviorScore: number;
}

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
    classes: { type: String },
    phone: { type: String },
    parentPhone: { type: String },
    plantData: { type: String },
    Number: { type: Number },
    joinDays: { type: Number, default: 0 },
    lateDays: { type: Number, default: 0 },
    leaveDays: { type: Number, default: 0 },
    absentDays: { type: Number, default: 0 },
    behaviorScore: { type: Number, default: 0 },
  },
  { collection: "ClientDB", timestamps: true }
);

const Student =
  (mongoose.models.Student as Model<IUser>) ||
  mongoose.model<IUser>("Student", UserSchema);

export default Student;
