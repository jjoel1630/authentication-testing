import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
	username: String,
	email: { type: String, required: true },
	password: String,
	refToken: { type: String },
});

export default mongoose.model("users", userSchema);
