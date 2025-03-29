import React, { useEffect, useState } from "react"
import io from "socket.io-client"

const socket = io(import.meta.env.VITE_API_BASE_URL)

function ChatWindow() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const token = localStorage.getItem("token")
  const user = token && JSON.parse(atob(token.split(".")[1]))

  // 👇 Confirm this prints a valid admin ID
  const adminId = import.meta.env.VITE_ADMIN_ID
  console.log("Admin ID from .env:", adminId)

  useEffect(() => {
    if (user?.id) socket.emit("join", user.id)

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off("receiveMessage")
    }
  }, [user?.id])

  useEffect(() => {
    const token = localStorage.getItem("token")

    if (user?.id) {
      socket.emit("join", user.id)

      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats/${adminId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then(setMessages)
    }

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg])
    })

    return () => {
      socket.off("receiveMessage")
    }
  }, [user?.id])

  const sendMessage = () => {
    if (!input.trim()) return

    const msg = {
      sender: user.id,
      recipient: adminId,
      content: input,
    }

    socket.emit("sendMessage", msg)
    setMessages((prev) => [...prev, msg])
    setInput("")
  }

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h2 className="text-xl font-bold mb-4">Chat with Oliviah Shaffer</h2>
      <div className="bg-neutral-700 p-4 rounded h-96 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === user.id ? "text-right" : "text-left"}>
            <p className="inline-block px-3 py-1 rounded bg-blue-500">{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input className="flex-1 p-2 bg-neutral-600 rounded-l" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your message..." />
        <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded-r hover:bg-blue-700 transition">
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
