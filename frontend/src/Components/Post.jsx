import React, { useState } from "react"

function Post({ post }) {
  const [liked, setLiked] = useState(false)
  const [comments, setComments] = useState(post.comments || [])

  const toggleLike = () => setLiked(!liked)

  return (
    <div className="bg-neutral-800 text-white rounded-xl p-6 shadow-md mb-6">
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4">
        <img src={post.user.avatar} alt="avatar" className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold">{post.user.name}</p>
          <p className="text-sm text-gray-400">{post.timestamp}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className="mb-4">
        <p>{post.content}</p>
        {post.image && <img src={post.image} alt="Post" className="mt-3 rounded-lg max-h-96 object-cover w-full" />}
      </div>

      {/* Like and Comment */}
      <div className="flex items-center gap-4 mb-4">
        <button onClick={toggleLike} className="text-blue-400 hover:text-blue-500">
          {liked ? "❤️ Liked" : "🤍 Like"}
        </button>
        <button className="text-gray-300 hover:text-white">💬 Comment</button>
      </div>

      {/* Comments */}
      <div className="space-y-3">
        {comments.map((comment, i) => (
          <div key={i} className="bg-neutral-700 p-3 rounded-lg">
            <p className="text-sm font-medium">{comment.user}</p>
            <p className="text-sm">{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Post
