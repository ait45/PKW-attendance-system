import mongoose, { Model, Schema, Document } from "mongoose";

export interface ILineUser extends Document {
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
  role: "admin" | "teacher" | "student" | "parent" | "other";
  isActive: boolean;
  note: string;
  addedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

const LineUserSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    displayName: {
      type: String,
      default: "",
    },
    pictureUrl: {
      type: String,
      default: "",
    },
    statusMessage: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student", "parent", "other"],
      default: "other",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    note: {
      type: String,
      default: "",
    },
    addedBy: {
      type: String,
      default: "system",
    },
  },
  { collection: "LineUsers", timestamps: true },
);

const LineUser =
  (mongoose.models.LineUser as Model<ILineUser>) ||
  mongoose.model<ILineUser>("LineUser", LineUserSchema);

export default LineUser;
