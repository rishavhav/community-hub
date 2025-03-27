import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"

const API = import.meta.env.VITE_API_BASE_URL

function Navbar() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token")
      if (!token) return

      try {
        const res = await fetch(`${API}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error("Failed to fetch user")

        const data = await res.json()
        setUser(data)
      } catch (err) {
        console.error("User fetch failed:", err)
      }
    }

    fetchUser()
  }, [])

  const avatarUrl = user?.profilePic || "/avatar1.jpg"

  return (
    <nav className="z-10 relative bg-black border-gray-200  px-20">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src="/logo.png" className="h-10 scale-180" alt="Logo" />
        </a>

        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <Link to="/settings">
            <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">
              <span className="sr-only">Open user menu</span>
              <img className="w-8 h-8 rounded-full object-cover" src={avatarUrl} alt="user avatar" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
