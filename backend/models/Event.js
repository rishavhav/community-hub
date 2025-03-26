import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  type: { type: String, enum: ["future", "past"], required: true },
  zoomLink: { type: String, required: true },
  image: { type: String, required: true },
})

export default mongoose.model("Event", eventSchema)
