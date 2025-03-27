// controllers/channelController.js
import Channel from "../models/Channel.js"

export const createChannel = async (req, res) => {
  try {
    const { name } = req.body
    const slug = name.toLowerCase().replace(/\s+/g, "-")

    const existing = await Channel.findOne({ slug })
    if (existing) return res.status(400).json({ message: "Channel already exists" })

    const newChannel = await Channel.create({ name, slug })
    res.status(201).json(newChannel)
  } catch (err) {
    res.status(500).json({ error: "Failed to create channel" })
  }
}

export const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find().sort({ createdAt: 1 })
    res.json(channels)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch channels" })
  }
}
