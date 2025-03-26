// src/pages/Login.jsx
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
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white">
      <form onSubmit={handleLogin} className="bg-neutral-800 p-8 rounded-lg w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 rounded bg-neutral-700 outline-none" />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 rounded bg-neutral-700 outline-none" />
        <button className="w-full bg-blue-600 hover:bg-blue-700 transition rounded p-2 font-semibold">Login</button>
      </form>
    </div>
  )
}

export default Login
