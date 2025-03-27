// models/Channel.js
import mongoose from "mongoose"

const channelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true }
)

export default mongoose.model("Channel", channelSchema)
