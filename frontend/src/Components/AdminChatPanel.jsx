import React, { useEffect, useState } from "react"
import ChatPopup from "./ChatPopup"

function AdminChatPanel() {
  const [conversations, setConversations] = useState({})
  const [activeUser, setActiveUser] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setConversations)
  }, [])

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Admin Panel</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.entries(conversations).map(([userId, msgs]) => (
          <div key={userId} onClick={() => setActiveUser(userId)} className="bg-neutral-800 p-4 rounded cursor-pointer">
            <p className="font-semibold">{msgs[0]?.sender?.name || "User"}</p>
            <p className="text-sm text-gray-400 truncate">{msgs[msgs.length - 1]?.content}</p>
          </div>
        ))}
      </div>

      {activeUser && <ChatPopup userId={activeUser} onClose={() => setActiveUser(null)} />}
    </div>
  )
}

export default AdminChatPanel
