import React, { useState } from "react"

function CreateUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    plan: "monthly", // or dropdown
  })
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")
  const API = import.meta.env.VITE_API_BASE_URL

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const res = await fetch(`${API}/api/admin/create-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (res.ok) {
        setSuccess("User created successfully!")
        setForm({ name: "", email: "", password: "", plan: "monthly" })
      } else {
        setError(data.message || "Failed to create user.")
      }
    } catch (err) {
      console.error(err)
      setError("Something went wrong.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white flex justify-center items-center px-4">
      <form onSubmit={handleSubmit} className="bg-white/5 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md space-y-6">
        <h2 className="text-2xl font-bold text-center text-white">Create User</h2>

        {success && <p className="text-green-400 text-sm text-center">{success}</p>}
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}

        <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required className="w-full p-3 rounded-xl bg-neutral-800/80 text-white placeholder-gray-400" />

        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required className="w-full p-3 rounded-xl bg-neutral-800/80 text-white placeholder-gray-400" />

        <input name="password" value={form.password} onChange={handleChange} placeholder="Password" type="password" required className="w-full p-3 rounded-xl bg-neutral-800/80 text-white placeholder-gray-400" />

        <select name="plan" value={form.plan} onChange={handleChange} className="w-full p-3 rounded-xl bg-neutral-800/80 text-white">
          <option value="monthly">Monthly</option>
          <option value="annual">Annual</option>
          <option value="gold">Gold</option>
        </select>

        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl shadow-md">
          Create User
        </button>
      </form>
    </div>
  )
}

export default CreateUser
