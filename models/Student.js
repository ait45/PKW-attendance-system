import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        _id: {
            type: String
        },
        studentId: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        class: {
            type: String,
            require: true
        },
        grade: {
            type: String,
            required: true
        },
        phone: {
            type: Number,
            required: true
        },
        parentPhone: {
            type: Number,
            required: true
        },
        address: {
            type: String,
            required: true

        },
        role: {
            type: String,
            required: true,
            default: "user"
        },

    },
    { collection: "ClientDB", timestamps: true }


);

export default mongoose.models.User || mongoose.model("User", UserSchema);