import React from "react"
import { useNavigate, useLocation } from "react-router-dom"

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  // Helper to determine if the current path matches
  const isActive = (path) => location.pathname === path

  return (
    <div className="h-full p-3 space-y-2 w-60 bg-neutral-900 dark:text-gray-100">
      <div className="divide-y dark:divide-gray-300">
        <ul className="pt-2 pb-4 space-y-1 text-sm">
          <li className={isActive("/") ? "border border-white rounded-md" : ""}>
            <a href="/" className="flex items-center p-2 space-x-3 rounded-md">
              {/* icon */}
              <svg className="w-5 h-5 fill-current dark:text-gray-600" viewBox="0 0 512 512">
                <path d="..." />
              </svg>
              <span>Events</span>
            </a>
          </li>

          <li className={isActive("/chat") ? "border border-white rounded-md" : ""}>
            <a href="/chat" className="flex items-center p-2 space-x-3 rounded-md">
              <svg className="w-5 h-5 fill-current dark:text-gray-600" viewBox="0 0 512 512">
                <path d="..." />
              </svg>
              <span>Chat</span>
            </a>
          </li>

          <li className={isActive("/courses") ? "border border-white rounded-md" : ""}>
            <a href="/courses" className="flex items-center p-2 space-x-3 rounded-md">
              <svg className="w-5 h-5 fill-current dark:text-gray-600" viewBox="0 0 512 512">
                <path d="..." />
              </svg>
              <span>Courses</span>
            </a>
          </li>

          <li className={isActive("/community") ? "border border-white rounded-md" : ""}>
            <a href="/community" className="flex items-center p-2 space-x-3 rounded-md">
              <svg className="w-5 h-5 fill-current dark:text-gray-600" viewBox="0 0 512 512">
                <path d="..." />
              </svg>
              <span>Community</span>
            </a>
          </li>
        </ul>

        <ul className="pt-4 pb-2 space-y-1 text-sm">
          <li className={isActive("/settings") ? "border border-white rounded-md" : ""}>
            <a href="/settings" className="flex items-center p-2 space-x-3 rounded-md">
              <svg className="w-5 h-5 fill-current dark:text-gray-600" viewBox="0 0 512 512">
                <path d="..." />
              </svg>
              <span>Settings</span>
            </a>
          </li>

          <li>
            <button onClick={handleLogout} className="flex items-center p-2 space-x-3 rounded-md w-full text-left">
              <svg className="w-5 h-5 fill-current dark:text-gray-600" viewBox="0 0 512 512">
                <path d="..." />
              </svg>
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Sidebar
