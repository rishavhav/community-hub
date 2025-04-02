import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import clsx from "clsx"

function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const isActive = (path) => location.pathname === path

  const NavLink = ({ path, label }) => (
    <li className={isActive(path) ? "border border-white rounded-md" : ""}>
      <a href={path} onClick={onClose} className="flex items-center p-2 space-x-3 rounded-md hover:bg-neutral-800">
        <span>{label}</span>
      </a>
    </li>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block h-full p-3 space-y-2 w-60 bg-neutral-900 text-white flex-shrink-0">
        <div className="divide-y divide-gray-700">
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            <NavLink path="/" label="Events" />
            <NavLink path="/chat" label="Chat" />
            <NavLink path="/courses" label="Courses" />
            <NavLink path="/community" label="Community" />
          </ul>
          <ul className="pt-4 pb-2 space-y-1 text-sm">
            <NavLink path="/settings" label="Settings" />
            <li>
              <button onClick={handleLogout} className="flex items-center p-2 space-x-3 rounded-md w-full text-left hover:bg-neutral-800">
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div className={clsx("fixed top-0 left-0 h-full w-64 bg-neutral-900 text-white p-4 z-50 transition-transform duration-300 md:hidden", isOpen ? "translate-x-0" : "-translate-x-full")}>
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold">Menu</span>
          <button onClick={onClose}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <ul className="space-y-3">
          <NavLink path="/" label="Events" />
          <NavLink path="/chat" label="Chat" />
          <NavLink path="/courses" label="Courses" />
          <NavLink path="/community" label="Community" />
          <NavLink path="/settings" label="Settings" />
          <li>
            <button onClick={handleLogout} className="text-left w-full p-2 rounded hover:bg-neutral-800">
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Backdrop */}
      {isOpen && <div onClick={onClose} className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"></div>}
    </>
  )
}

export default Sidebar
