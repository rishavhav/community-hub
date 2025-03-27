import Message from "../models/Message.js"

export const getChatsForAdmin = async (req, res) => {
  try {
    const chats = await Message.find().populate("sender", "name email profilePic").sort("-createdAt")
    const grouped = {}

    chats.forEach((msg) => {
      const senderId = msg.sender._id.toString()
      if (!grouped[senderId]) grouped[senderId] = []
      grouped[senderId].push(msg)
    })

    res.json(grouped)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin chats" })
  }
}

export const getChatWithUser = async (req, res) => {
  try {
    const userId = req.params.userId
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: req.userId },
        { sender: req.userId, recipient: userId },
      ],
    }).sort("createdAt")

    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversation" })
  }
}
