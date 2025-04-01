import React, { useEffect, useState } from "react"
import io from "socket.io-client"
import dayjs from "dayjs"
import isToday from "dayjs/plugin/isToday"

dayjs.extend(isToday)

const socket = io(import.meta.env.VITE_API_BASE_URL)

function ChatPopup({ userId, user, onClose, onMessagesRead }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")

  const token = localStorage.getItem("token")
  const decoded = token && JSON.parse(atob(token.split(".")[1]))
  const adminId = decoded?.id

  useEffect(() => {
    socket.emit("join", userId)
    socket.emit("markRead", { adminId, userId })
  }, [userId])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((msgs) => {
        setMessages(msgs)
        if (onMessagesRead) onMessagesRead(userId)
      })
  }, [userId])

  useEffect(() => {
    const handleReceive = (msg) => {
      if (msg.sender === userId || msg.recipient === userId) {
        setMessages((prev) => {
          const exists = prev.some((m) => m._id === msg._id)
          return exists ? prev : [...prev, msg]
        })
      }
    }

    socket.on("receiveMessage", handleReceive)
    return () => socket.off("receiveMessage", handleReceive)
  }, [userId])

  useEffect(() => {
    const scrollBox = document.getElementById("chat-scroll")
    if (scrollBox) scrollBox.scrollTop = scrollBox.scrollHeight
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return

    const msg = {
      sender: adminId,
      recipient: userId,
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
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-lg w-[90%] max-w-lg h-[80vh] relative text-white flex flex-col">
        <button onClick={onClose} className="absolute top-2 right-4 text-white text-xl">
          ×
        </button>

        <div className="flex items-center mb-4 gap-3">
          <img src={user?.profilePic || "/avatar1.jpg"} alt="User" className="w-8 h-8 rounded-full object-cover" />
          <h3 className="text-lg font-semibold">{user?.name || "User"}</h3>
        </div>

        <div id="chat-scroll" className="flex-1 space-y-6 overflow-y-auto mb-4 pr-2">
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date}>
              <div className="text-center text-gray-400 text-sm mb-2">{dayjs(date).isToday() ? "Today" : dayjs(date).format("MMMM D, YYYY")}</div>
              {msgs.map((msg, i) => {
                const isUser = msg.sender === userId
                const time = dayjs(msg.createdAt).format("hh:mm A")

                return (
                  <div key={msg._id || i} className={`flex ${isUser ? "justify-start" : "justify-end"}`}>
                    <div className="max-w-[75%]">
                      <div className={`inline-block px-3 py-2 rounded-xl ${isUser ? "bg-gray-600 text-white rounded-bl-none" : "bg-blue-600 text-white rounded-br-none"}`}>
                        <span className="text-sm">{msg.content}</span>
                      </div>
                      <div className={`text-xs text-gray-400 mt-1 ${isUser ? "text-left" : "text-right"}`}>{time}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        <div className="mt-2 flex">
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
    </div>
  )
}

export default ChatPopup
