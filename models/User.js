import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
    {
        _id: {
            type: String
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: false,
            default: "user"
        },

    },
    { timestamps: true }


);

export default mongoose.models.User || mongoose.model("User", UserSchema);