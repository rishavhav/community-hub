import React, { useState, useEffect } from "react"
import Comment from "./Comment"
import CommentForm from "./CommentForm"
import { jwtDecode } from "jwt-decode"

function Post({ post, onUpdate }) {
  const [comments, setComments] = useState(post.comments || [])
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes?.length || 0)
  const [showFullContent, setShowFullContent] = useState(false)
  const [visibleComments, setVisibleComments] = useState(2)

  const token = localStorage.getItem("token")
  const userId = token ? jwtDecode(token)?.id : null

  useEffect(() => {
    if (userId && post.likes?.includes(userId)) {
      setLiked(true)
    }
  }, [post.likes, userId])

  const toggleLike = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${post._id}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const updated = await res.json()
      onUpdate(updated)
      setLiked(updated.likes.includes(userId))
      setLikesCount(updated.likes.length)
    } catch (err) {
      console.error("Like error", err)
    }
  }

  const addComment = async (text) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${post._id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: text }),
      })

      if (!res.ok) throw new Error("Failed to add comment")

      const updatedPost = await res.json()
      setComments(updatedPost.comments)
      onUpdate(updatedPost)
    } catch (err) {
      console.error("Comment error:", err)
      alert("Failed to add comment")
    }
  }

  const replyToComment = async (index, text) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts/${post._id}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ commentIndex: index, reply: text }),
      })
      const updated = await res.json()
      setComments(updated.comments)
      onUpdate(updated)
    } catch (err) {
      console.error("Reply error:", err)
    }
  }

  const toggleShowMore = () => setShowFullContent(!showFullContent)
  const showAllComments = () => setVisibleComments(comments.length)

  return (
    <div className="bg-neutral-800 text-white rounded-xl p-6 shadow-md mb-6">
      {/* Author */}
      <div className="flex items-center gap-3 mb-4">
        <img src={post.author?.profilePic || "/avatar1.jpg"} alt="avatar" className="w-10 h-10 rounded-full" />
        <div>
          <p className="font-semibold">{post.author?.name || "Unknown"}</p>
          <p className="text-sm text-gray-400">{new Date(post.createdAt).toLocaleString()}</p>
        </div>
      </div>

      {/* Post Content */}
      <div className={`mb-2 ${!showFullContent ? "max-h-[160px] overflow-hidden" : ""}`}>
        <p>{post.content}</p>
      </div>

      {/* View more toggle */}
      {!showFullContent && post.content?.length > 300 && (
        <button onClick={toggleShowMore} className="text-sm text-blue-400 hover:underline mb-2">
          View more
        </button>
      )}
      {showFullContent && (
        <button onClick={toggleShowMore} className="text-sm text-blue-400 hover:underline mb-2">
          Show less
        </button>
      )}

      {/* Image */}
      {post.image && <img src={post.image} alt="Post" className="rounded w-full max-h-96 object-cover" />}

      {/* Like */}
      <div className="flex items-center gap-4 my-4">
        <button onClick={toggleLike} className="text-blue-400 hover:text-blue-500">
          {liked ? "❤️ Liked" : "🤍 Like"} ({likesCount})
        </button>
      </div>

      {/* Comments */}
      <div className="mt-4 space-y-4">
        {comments.slice(0, visibleComments).map((comment, i) => (
          <Comment key={i} comment={comment} onReply={(text) => replyToComment(i, text)} />
        ))}

        {comments.length > visibleComments && (
          <button onClick={showAllComments} className="text-sm text-blue-400 hover:underline ml-2 mt-2">
            View more comments ({comments.length - visibleComments})
          </button>
        )}
      </div>

      {/* Comment Form */}
      <CommentForm onSubmit={addComment} />
    </div>
  )
}

export default Post
