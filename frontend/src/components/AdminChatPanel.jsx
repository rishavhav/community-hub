import React, { useEffect, useState } from "react"
import ChatPopup from "./ChatPopup"
import io from "socket.io-client"

const socket = io(import.meta.env.VITE_API_BASE_URL)

function AdminChatPanel() {
  const [conversations, setConversations] = useState({})
  const [allUsers, setAllUsers] = useState([])
  const [activeUser, setActiveUser] = useState(null)
  const [search, setSearch] = useState("")

  const token = localStorage.getItem("token")
  const adminId = token && JSON.parse(atob(token.split(".")[1])).id

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setConversations)
  }, [])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((users) => {
        const filtered = users.filter((u) => u._id !== adminId)
        setAllUsers(filtered)
      })
  }, [])

  useEffect(() => {
    const handleReceive = (msg) => {
      const userKey = msg.sender._id || msg.sender
      setConversations((prev) => {
        const existing = prev[userKey] || []
        return {
          ...prev,
          [userKey]: [...existing, msg],
        }
      })
    }

    socket.on("receiveMessage", handleReceive)
    return () => socket.off("receiveMessage", handleReceive)
  }, [])

  const handleMessagesRead = async (userId) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/chats/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const updated = await res.json()
      setConversations(updated)
    } catch (err) {
      console.error("❌ Failed to refresh chats:", err)
    }
  }

  const filteredUsers = allUsers.filter((user) => user.name.toLowerCase().includes(search.toLowerCase()))

  const unreadUsers = Object.entries(conversations)
    .map(([userId, msgs]) => {
      const sorted = [...msgs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      const latest = sorted[0]
      const user = allUsers.find((u) => u._id === userId)
      const hasUnread = latest && !latest.read && latest.sender !== adminId
      return hasUnread ? { userId, user, latestMsg: latest } : null
    })
    .filter(Boolean)

  const latestMsgsToAdmin = Object.entries(conversations)
    .map(([userId, msgs]) => {
      const user = allUsers.find((u) => u._id === userId)
      const msgsToAdmin = msgs.filter((m) => m.recipient === adminId)
      if (msgsToAdmin.length === 0) return null
      const latest = [...msgsToAdmin].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]
      return { userId, user, latestMsg: latest }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.latestMsg.createdAt) - new Date(a.latestMsg.createdAt))

  return (
    <div className="p-6 text-white">
      <h2 className="text-2xl mb-4">Admin Panel</h2>

      <input className="w-full p-2 mb-4 bg-neutral-700 rounded" placeholder="Search user..." value={search} onChange={(e) => setSearch(e.target.value)} />

      {unreadUsers.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg mb-2">Unread Messages</h3>
          <div className="grid grid-cols-3 gap-4">
            {unreadUsers.map(({ userId, user, latestMsg }) => (
              <div key={userId} onClick={() => setActiveUser({ id: userId, name: user?.name, profilePic: user?.profilePic })} className="bg-green-800 p-4 rounded cursor-pointer hover:bg-green-700 transition">
                <p className="font-semibold">{user?.name || "User"}</p>
                <p className="text-sm text-gray-200 truncate">{latestMsg?.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-lg mb-2">All Users</h3>
      <div className="grid grid-cols-3 gap-4">
        {filteredUsers.map((user) => {
          const msgs = conversations[user._id] || []
          const sortedMsgs = [...msgs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          const latestMsg = sortedMsgs[0]

          return (
            <div key={user._id} onClick={() => setActiveUser({ id: user._id, name: user.name, profilePic: user.profilePic })} className="bg-neutral-800 p-4 rounded cursor-pointer hover:bg-neutral-700 transition">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-400 truncate">{latestMsg ? latestMsg.content : "Start a conversation"}</p>
            </div>
          )
        })}
      </div>

      <h3 className="text-lg mt-10 mb-2">All Messages Received by Admin</h3>
      <div className="grid grid-cols-3 gap-4">
        {latestMsgsToAdmin.map(({ userId, user, latestMsg }) => (
          <div key={userId} onClick={() => setActiveUser({ id: userId, name: user?.name, profilePic: user?.profilePic })} className="bg-neutral-800 p-4 rounded cursor-pointer hover:bg-neutral-700 transition">
            <p className="font-semibold">{user?.name || "User"}</p>
            <p className="text-sm text-gray-400 truncate">{latestMsg?.content}</p>
            <p className="text-xs text-gray-500">{new Date(latestMsg.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>

      {activeUser && <ChatPopup userId={activeUser.id} user={activeUser} onClose={() => setActiveUser(null)} onMessagesRead={handleMessagesRead} />}
    </div>
  )
}

export default AdminChatPanel
