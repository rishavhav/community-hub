import React from "react"
import Post from "../components/Post"

const samplePosts = [
  {
    user: { name: "Oliviah Shaffer", avatar: "/avatar1.jpg" },
    content: "Just finished a cool React project!",
    image: "/profile-pic.jpg",
    timestamp: "2 hours ago",
    comments: [
      { user: "Bob", text: "Nice work!" },
      { user: "Charlie", text: "Looks awesome!" },
    ],
  },
  {
    user: { name: "Oliviah Shaffer", avatar: "/avatar1.jpg" },
    content: "Just finished a cool React project!",
    image: "/profile-pic.jpg",
    timestamp: "2 hours ago",
    comments: [
      { user: "Bob", text: "Nice work!" },
      { user: "Charlie", text: "Looks awesome!" },
    ],
  },
]

function CommunityPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      {samplePosts.map((post, i) => (
        <Post key={i} post={post} />
      ))}
    </div>
  )
}

export default CommunityPage
