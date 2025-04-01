import { Server } from "socket.io"
import Message from "./models/Message.js"

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  })

  io.on("connection", (socket) => {
    console.log("✅ User connected:", socket.id)

    socket.on("join", (userId) => {
      socket.join(userId)
    })

    socket.on("sendMessage", async (data) => {
      try {
        const message = new Message({
          sender: data.sender,
          recipient: data.recipient,
          content: data.content,
        })

        await message.save()

        // ✅ Emit to both rooms for live updates
        io.to(data.recipient).emit("receiveMessage", message)
        io.to(data.sender).emit("receiveMessage", message)
      } catch (err) {
        console.error("❌ Message error:", err)
      }
    })

    socket.on("markRead", async ({ adminId, userId }) => {
      try {
        await Message.updateMany({ sender: userId, recipient: adminId, read: false }, { $set: { read: true } })
        console.log(`📬 Marked messages as read for admin: ${adminId}, user: ${userId}`)
      } catch (err) {
        console.error("❌ Failed to mark messages as read:", err)
      }
    })

    socket.on("disconnect", () => {
      console.log("🚪 User disconnected:", socket.id)
    })
  })
}

export default setupSocket
