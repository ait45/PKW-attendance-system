import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    _id: String,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {type: String, required: true }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);