import React, { useEffect, useState } from "react"
import io from "socket.io-client"

const socket = io(import.meta.env.VITE_API_BASE_URL)

function ChatWindow() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const token = localStorage.getItem("token")
  const user = token && JSON.parse(atob(token.split(".")[1]))
  const adminId = import.meta.env.VITE_ADMIN_ID

  useEffect(() => {
    const scrollBox = document.getElementById("user-chat-scroll")
    if (scrollBox) {
      scrollBox.scrollTop = scrollBox.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (!user?.id) return

    socket.emit("join", user.id)

    // Fetch existing chat
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setMessages)

    // Socket message handler with deduplication
    const handleReceive = (msg) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id)
        return exists ? prev : [...prev, msg]
      })
    }

    socket.on("receiveMessage", handleReceive)

    return () => {
      socket.off("receiveMessage", handleReceive)
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
    setInput("")
  }

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <h2 className="text-xl font-bold mb-4">Chat with Oliviah Shaffer</h2>
      <div id="user-chat-scroll" className="bg-neutral-700 p-4 rounded h-96 overflow-y-auto space-y-2">
        {messages.map((msg, i) => (
          <div>
            <div key={msg._id || i} className={msg.sender === user.id ? "text-right" : "text-left"}>
              <p className="inline-block px-3 py-1 rounded bg-blue-500">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          className="flex-1 p-2 bg-neutral-600 rounded-l"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage()
          }}
          placeholder="Type your message..."
        />

        <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded-r hover:bg-blue-700 transition">
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
