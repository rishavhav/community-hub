import ChatWindow from "../components/ChatWindow.jsx"
import AdminChatPanel from "../components/AdminChatPanel.jsx"

const token = localStorage.getItem("token")
const decoded = token && JSON.parse(atob(token.split(".")[1]))

function ChatPage() {
  const isAdmin = decoded?.email === import.meta.env.VITE_ADMIN_EMAIL

  return <div>{isAdmin ? <AdminChatPanel /> : <ChatWindow />}</div>
}

export default ChatPage
