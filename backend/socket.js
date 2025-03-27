import { Server } from "socket.io"
import Message from "./models/Message.js"

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  })

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id)

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
        io.to(data.recipient).emit("receiveMessage", message)
      } catch (err) {
        console.error("Message error:", err)
      }
    })

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
    })
  })
}

export default setupSocket
