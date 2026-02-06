import mongoose, { Model, Schema, Document } from "mongoose";

export interface IPasswordResetRequest extends Document {
  studentId: string;
  studentName: string;
  classes: string;
  reason: string;
  status: "pending" | "acknowledged" | "resolved";
  acknowledgedBy: string;
  acknowledgedAt: Date;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

const PasswordResetRequestSchema = new Schema(
  {
    studentId: {
      type: String,
      required: true,
    },
    studentName: {
      type: String,
      default: "",
    },
    classes: {
      type: String,
      default: "",
    },
    reason: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "acknowledged", "resolved"],
      default: "pending",
    },
    acknowledgedBy: {
      type: String,
      default: "",
    },
    acknowledgedAt: {
      type: Date,
      default: null,
    },
    note: {
      type: String,
      default: "",
    },
  },
  { collection: "PasswordResetRequests", timestamps: true },
);

const PasswordResetRequest =
  (mongoose.models.PasswordResetRequest as Model<IPasswordResetRequest>) ||
  mongoose.model<IPasswordResetRequest>(
    "PasswordResetRequest",
    PasswordResetRequestSchema,
  );

export default PasswordResetRequest;
