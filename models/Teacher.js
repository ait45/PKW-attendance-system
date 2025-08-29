import mongoose, { Schema } from "mongoose";

const TeacherSchema = Schema(
    {
        _id: {
            type: String
        },
        teacherId: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        }


    },
    { collection: "TeacherDB", Timestamp: true }
);
export default mongoose.models.Teacher || mongoose.model("Teacher", TeacherSchema);
