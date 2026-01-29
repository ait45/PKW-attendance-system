import mongoose, { Model, Schema, Document } from "mongoose";

export interface IIssueReport extends Document {
  type: "bug" | "suggestion" | "question" | "other";
  title: string;
  description: string;
  reportedBy: string;
  studentId: string;
  status: "pending" | "in_progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  adminNote: string;
  createdAt: Date;
  updatedAt: Date;
}

const IssueReportSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["bug", "suggestion", "question", "other"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    reportedBy: {
      type: String,
      default: "anonymous",
    },
    studentId: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "resolved", "closed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    adminNote: {
      type: String,
      default: "",
    },
  },
  { collection: "IssueReports", timestamps: true },
);

const IssueReport =
  (mongoose.models.IssueReport as Model<IIssueReport>) ||
  mongoose.model<IIssueReport>("IssueReport", IssueReportSchema);

export default IssueReport;
