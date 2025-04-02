import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const API = import.meta.env.VITE_API_BASE_URL

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (res.ok && data.user && data.token) {
        localStorage.setItem("token", data.token)
        navigate("/")
      } else {
        setError(data.message || "Login failed")
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="flex justify-center scale-250 bg-black p-4 rounded-full">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain transition-transform hover:scale-105 duration-300" />
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 space-y-6">
          <h2 className="text-3xl font-bold text-center text-white tracking-wide">Sign in to your account</h2>

          {error && <p className="text-red-400 text-sm text-center border border-red-400 bg-red-400/10 p-2 rounded-md">{error}</p>}

          <div className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 rounded-xl bg-neutral-800/80 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 rounded-xl bg-neutral-800/80 placeholder-gray-300 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
          </div>

          <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition duration-300 rounded-xl p-3 font-semibold text-white shadow-md hover:shadow-lg">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
