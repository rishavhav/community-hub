import React, { useEffect, useState } from "react"
import io from "socket.io-client"
import dayjs from "dayjs"
import isToday from "dayjs/plugin/isToday"

const socket = io(import.meta.env.VITE_API_BASE_URL)
dayjs.extend(isToday)

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

    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setMessages)

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

  const groupMessagesByDate = (msgs) => {
    const groups = {}
    msgs.forEach((msg) => {
      const dateKey = dayjs(msg.createdAt).format("YYYY-MM-DD")
      if (!groups[dateKey]) groups[dateKey] = []
      groups[dateKey].push(msg)
    })
    return groups
  }

  const groupedMessages = groupMessagesByDate(messages)

  return (
    <div className="p-6 max-w-xl mx-auto text-white">
      <div className="flex gap-2">
        <img class="w-8 h-8 rounded-full" src="/oliviah.jpg" alt="Oliviah" />
        <h2 className="text-xl font-bold mb-4">Chat with Oliviah Shaffer</h2>
      </div>
      <div id="user-chat-scroll" className="bg-neutral-700 p-4 rounded h-96 overflow-y-auto space-y-6">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className="text-center text-gray-400 text-sm mb-2">{dayjs(date).isToday() ? "Today" : dayjs(date).format("MMMM D, YYYY")}</div>
            {msgs.map((msg, i) => {
              const isUser = msg.sender === user.id
              const time = dayjs(msg.createdAt).format("hh:mm A")

              return (
                <div key={msg._id || i} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className="max-w-[75%]">
                    <div className={`inline-block px-3 py-2 rounded-xl ${isUser ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-600 text-white rounded-bl-none"}`}>
                      <span className="text-sm">{msg.content}</span>
                    </div>
                    <div className={`text-xs text-gray-400 mt-1 ${isUser ? "text-right" : "text-left"}`}>{time}</div>
                  </div>
                </div>
              )
            })}
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
