import mongoose, { Model, Schema, Document } from "mongoose";

export interface INotificationRead extends Document {
  notificationId: number;
  userId: string;
  userRole: "teacher" | "student";
  readAt: Date;
}

const NotificationReadSchema = new Schema(
  {
    notificationId: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userRole: {
      type: String,
      enum: ["teacher", "student"],
      required: true,
    },
    readAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    collection: "NotificationReads",
    timestamps: true,
  },
);

// Create compound index for unique read per notification per user
NotificationReadSchema.index(
  { notificationId: 1, userId: 1 },
  { unique: true },
);

const NotificationRead =
  (mongoose.models.NotificationRead as Model<INotificationRead>) ||
  mongoose.model<INotificationRead>("NotificationRead", NotificationReadSchema);

export default NotificationRead;
