import mongoose, { Model, Schema } from "mongoose";
interface IUser {
  studentId: string;
  name: string;
  password: string;
  status: "Active" | "Idle";
  role: string;
  isAdmin: boolean;
  classes: string;
}
const UserSchema = new Schema<IUser>(
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
  },
  { collection: "ClientDB", timestamps: true }
);
const Student =
  (mongoose.models.Student as Model<IUser>) ||
  mongoose.model<IUser>("Student", UserSchema);

export default Student;
