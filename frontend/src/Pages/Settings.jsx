import React, { useEffect, useState } from "react"
import { jwtDecode } from "jwt-decode"

const API = import.meta.env.VITE_API_BASE_URL

function Settings() {
  const token = localStorage.getItem("token")
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [password, setPassword] = useState("")
  const [preview, setPreview] = useState("")
  const [avatarBase64, setAvatarBase64] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    plan: "",
  })

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API}/api/user/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        const data = await res.json()
        setUser(data)
        setFormData({ name: data.name || "", email: data.email || "", plan: data.plan || "" })
        setPreview(data.profilePic || "/avatar1.jpg")
        setLoading(false)
      } catch (err) {
        console.error("Failed to load profile", err)
      }
    }

    if (token) fetchProfile()
  }, [token])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePicChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarBase64(reader.result)
        setPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUpdating(true)

    const payload = {
      ...formData,
      ...(password && { password }),
      ...(avatarBase64 && { profilePic: avatarBase64 }),
    }

    try {
      const res = await fetch(`${API}/api/user/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const updatedUser = await res.json()
      setUser(updatedUser)
      alert("Profile updated!")
    } catch (err) {
      console.error("Update error", err)
      alert("Failed to update profile")
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <p className="text-white p-6">Loading profile...</p>

  return (
    <div className="max-w-xl mx-auto p-6 text-white">
      <form onSubmit={handleSubmit} className="space-y-4 bg-neutral-800 p-6 rounded-lg shadow">
        {/* Profile Picture */}
        {/* Profile Picture */}
        <div className="flex flex-col items-center text-center">
          <h2 className="text-2xl font-semibold mb-4">{formData.name}</h2>

          <img src={preview || "/avatar1.jpg"} alt="Profile" className="h-24 w-24 rounded-full object-cover mb-4" />

          {/* Upload Button + Filename */}
          <div className="flex items-center gap-3">
            <label htmlFor="profile-pic-upload" className="inline-block px-4 py-2 bg-neutral-700 text-white rounded cursor-pointer hover:bg-neutral-600">
              Change Picture
            </label>
            {avatarBase64 && <p className="text-sm text-gray-300 truncate max-w-[200px]">Selected</p>}
          </div>

          <input id="profile-pic-upload" type="file" accept="image/*" onChange={handlePicChange} className="hidden" />
        </div>

        {/* Name */}
        <div>
          <label className="block mb-1">Name</label>
          <input name="name" value={formData.name} onChange={handleChange} className="w-full p-2 rounded bg-neutral-700 text-white" />
        </div>

        {/* Email (readonly) */}
        <div>
          <label className="block mb-1">Email</label>
          <input name="email" value={formData.email} disabled className="w-full p-2 rounded bg-neutral-700 text-white opacity-50" />
        </div>

        {/* Plan (readonly) */}
        <div>
          <label className="block mb-1">Plan</label>
          <input type="text" value={user.plan} disabled className="w-full p-2 rounded bg-neutral-700 text-white opacity-50" />
        </div>

        {/* Password */}
        <div>
          <label className="block mb-1">Update Password</label>
          <input type="password" placeholder="new password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-neutral-700 p-2 rounded" />
        </div>

        {/* Submit */}
        <button type="submit" disabled={updating} className="bg-blue-600 px-4 py-2 rounded text-white">
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  )
}

export default Settings
