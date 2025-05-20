// src/pages/CommunityPage.jsx
import React, { useState, useEffect } from "react"
import ChannelList from "../components/ChannelList.jsx"
import ChannelForm from "../components/ChannelForm.jsx"
import PostForm from "../components/PostForm.jsx"
import Post from "../components/Post.jsx"
import { jwtDecode } from "jwt-decode"

const API = import.meta.env.VITE_API_BASE_URL

function CommunityPage() {
  const token = localStorage.getItem("token")
  const [channels, setChannels] = useState([])
  const [selectedChannelId, setSelectedChannelId] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)

  // Check if user is admin
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token)
        setIsAdmin(decoded.email === import.meta.env.VITE_ADMIN_EMAIL)
      } catch (err) {
        console.error("Invalid token")
      }
    }
  }, [token])

  // Load channels on mount
  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const res = await fetch(`${API}/api/channels`)
        const data = await res.json()
        setChannels(data)
        if (data.length > 0) setSelectedChannelId(data[0]._id)
      } catch (err) {
        console.error("Failed to fetch channels", err)
      }
    }
    fetchChannels()
  }, [])

  // Load posts for selected channel
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API}/api/posts/channel/${selectedChannelId}`)
        const data = await res.json()
        setChannels((prev) => prev.map((ch) => (ch._id === selectedChannelId ? { ...ch, posts: data } : ch)))
      } catch (err) {
        console.error("Failed to fetch posts", err)
      }
    }

    if (selectedChannelId) fetchPosts()
  }, [selectedChannelId])

  const selectedChannel = channels.find((ch) => ch._id === selectedChannelId)

  const handleAddChannel = async (name) => {
    const res = await fetch(`${API}/api/channels`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
    const newChannel = await res.json()
    setChannels([...channels, newChannel])
    setSelectedChannelId(newChannel._id)
  }

  const handleAddPost = async ({ content, image }) => {
    try {
      const res = await fetch(`${API}/api/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          image, // base64 image string
          channelId: selectedChannelId,
        }),
      })

      if (!res.ok) throw new Error("Failed to add post")
      const newPost = await res.json()

      setChannels((prev) => prev.map((ch) => (ch._id === selectedChannelId ? { ...ch, posts: [newPost, ...(ch.posts || [])] } : ch)))
    } catch (err) {
      console.error(err)
      alert("Failed to add post")
    }
  }

  const handleUpdatePost = (updatedPostId, updatedPost) => {
    const updated = channels.map((ch) =>
      ch._id === selectedChannelId
        ? {
            ...ch,
            posts: ch.posts.map((p) => (p._id === updatedPostId ? updatedPost : p)),
          }
        : ch
    )
    setChannels(updated)
  }

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <div className="flex justify-between items-center mb-6">
        <ChannelList channels={channels} selected={selectedChannelId} onSelect={setSelectedChannelId} />
        {isAdmin && <ChannelForm onCreate={handleAddChannel} />}
      </div>

      {selectedChannelId && <PostForm onSubmit={handleAddPost} />}

      {selectedChannel?.posts?.map((post) => (
        <Post key={post._id} post={post} onUpdate={(newPost) => handleUpdatePost(post._id, newPost)} />
      ))}
    </div>
  )
}

export default CommunityPage
