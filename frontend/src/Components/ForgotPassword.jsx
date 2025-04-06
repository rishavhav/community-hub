import React, { useState } from "react"
import { useSetRecoilState } from "recoil"
import { authViewState } from "../recoil/authViewAtom"

function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const setAuthView = useSetRecoilState(authViewState)
  const API = import.meta.env.VITE_API_BASE_URL

  const handleReset = async (e) => {
    e.preventDefault()
    const res = await fetch(`${API}/api/user/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    const data = await res.json()
    setMessage(data.message || "Check your email for reset instructions.")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center scale-250 bg-black p-4 rounded-full">
          <img src="/logo.png" alt="Logo" className="w-20 h-20 object-contain transition-transform hover:scale-105 duration-300" />
        </div>

        <div className="space-y-6 bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10">
          <h2 className="text-2xl font-bold text-center text-white">Reset Your Password</h2>

          {message && <p className="text-green-400 text-sm text-center">{message}</p>}

          <form onSubmit={handleReset} className="space-y-4">
            <input type="email" placeholder="Enter your email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 rounded-xl bg-neutral-800/80 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition duration-300 rounded-xl p-3 font-semibold text-white shadow-md hover:shadow-lg">
              Send Reset Link
            </button>
          </form>

          <div className="text-center">
            <button onClick={() => setAuthView("login")} className="text-sm text-blue-400 hover:underline mt-4">
              ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
