// models/User.js
import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: String,
  plan: {
    type: String,
    enum: ["monthly", "annual", "gold"],
    required: true,
  },
  stripeCustomerId: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.model("User", userSchema)
