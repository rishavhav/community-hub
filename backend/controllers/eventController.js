import Event from "../models/Event.js"

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body)
    res.status(201).json(event)
  } catch (err) {
    console.error("Event creation error:", err.message)
    res.status(500).json({ message: err.message })
  }
}

export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 })
    res.json(events)
  } catch (err) {
    console.error("Event fetching error:", err.message)
    res.status(500).json({ message: err.message })
  }
}

export const deleteEvent = async (req, res) => {
  try {
    const deleted = await Event.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ message: "Event not found" })
    res.json({ message: "Event deleted" })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
