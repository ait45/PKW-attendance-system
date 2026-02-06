import mongoose, { Model, Schema, Document } from "mongoose";

export interface ILineLog extends Document {
  messageType: "push" | "broadcast" | "multicast";
  recipientType: string;
  recipientId: string;
  recipientCount: number;
  messageContent: string;
  altText: string;
  status: "success" | "failed" | "pending";
  errorMessage: string;
  sentBy: string;
  createdAt: Date;
}

const LineLogSchema = new Schema(
  {
    messageType: {
      type: String,
      enum: ["push", "broadcast", "multicast"],
      required: true,
    },
    recipientType: {
      type: String,
      default: "user",
    },
    recipientId: {
      type: String,
      default: "",
    },
    recipientCount: {
      type: Number,
      default: 1,
    },
    messageContent: {
      type: String,
      default: "",
    },
    altText: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      required: true,
    },
    errorMessage: {
      type: String,
      default: "",
    },
    sentBy: {
      type: String,
      default: "system",
    },
  },
  { collection: "LineMessageLogs", timestamps: true },
);

const LineLog =
  (mongoose.models.LineLog as Model<ILineLog>) ||
  mongoose.model<ILineLog>("LineLog", LineLogSchema);

export default LineLog;
