import React, { useState } from "react"
import CommentForm from "./CommentForm"

function Comment({ comment, onReply }) {
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [visibleReplies, setVisibleReplies] = useState(2)

  const toggleReplyBox = () => setShowReplyBox(!showReplyBox)
  const showAllReplies = () => setVisibleReplies(comment.replies?.length)

  return (
    <div className="bg-neutral-700 p-3 rounded-lg">
      {/* Comment */}
      <div className="flex items-center gap-3 mb-1">
        <img src={comment.user?.profilePic || "/avatar1.jpg"} alt="avatar" className="w-6 h-6 rounded-full object-cover" />
        <p className="text-sm font-semibold">{comment.user?.name || "User"}</p>
      </div>
      <p className="text-sm">{comment.comment}</p>

      {/* Reply toggle */}
      <button onClick={toggleReplyBox} className="text-blue-400 text-sm mt-1 hover:underline">
        {showReplyBox ? "Cancel" : "Reply"}
      </button>

      {/* Reply box */}
      {showReplyBox && (
        <div className="ml-4 mt-2">
          <CommentForm
            onSubmit={(text) => {
              onReply(text)
              setShowReplyBox(false)
            }}
          />
        </div>
      )}

      {/* Replies */}
      {comment.replies?.slice(0, visibleReplies).map((reply, i) => (
        <div key={i} className="ml-4 mt-2 border-l border-gray-600 pl-3">
          <div className="flex items-center gap-2 mb-1">
            <img src={reply.user?.profilePic || "/avatar1.jpg"} alt="avatar" className="w-5 h-5 rounded-full object-cover" />
            <p className="text-sm font-semibold">{reply.user?.name || "User"}:</p>
          </div>
          <p className="text-sm text-gray-300">{reply.reply}</p>
        </div>
      ))}

      {comment.replies?.length > visibleReplies && (
        <button onClick={showAllReplies} className="text-sm text-blue-400 hover:underline mt-2 ml-4">
          View more replies ({comment.replies.length - visibleReplies})
        </button>
      )}
    </div>
  )
}

export default Comment
