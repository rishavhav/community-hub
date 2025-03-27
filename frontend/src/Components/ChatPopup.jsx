import React, { useEffect, useState } from "react"

function ChatPopup({ userId, onClose }) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setMessages)
  }, [userId])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-neutral-800 p-6 rounded-lg w-[90%] max-w-lg h-[70vh] overflow-y-auto relative text-white">
        <button onClick={onClose} className="absolute top-2 right-4 text-white text-xl">
          ×
        </button>
        <h3 className="text-lg font-semibold mb-3">Chat with User</h3>
        <div className="space-y-2">
          {messages.map((msg, i) => (
            <div key={i} className={`${msg.sender === userId ? "text-left" : "text-right"}`}>
              <span className="inline-block px-3 py-1 bg-blue-500 rounded">{msg.content}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatPopup
