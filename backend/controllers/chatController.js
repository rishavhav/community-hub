// controllers/chatController.js
import Message from "../models/Message.js"

// 📥 Admin: Get all conversations grouped by user
export const getChatsForAdmin = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [{ sender: req.userId }, { recipient: req.userId }],
    })
      .sort({ createdAt: 1 })
      .lean()

    const grouped = {}

    messages.forEach((msg) => {
      const otherUserId = msg.sender.toString() === req.userId ? msg.recipient.toString() : msg.sender.toString()

      if (!grouped[otherUserId]) grouped[otherUserId] = []
      grouped[otherUserId].push(msg)
    })

    res.json(grouped)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch admin chats" })
  }
}

// 💬 Admin: Get conversation with a specific user & mark unread as read
export const getChatWithUser = async (req, res) => {
  try {
    const userId = req.params.userId
    const adminId = req.userId

    // Mark messages as read
    await Message.updateMany({ sender: userId, recipient: adminId, read: false }, { $set: { read: true } })

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: adminId },
        { sender: adminId, recipient: userId },
      ],
    }).sort("createdAt")

    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch conversation" })
  }
}
