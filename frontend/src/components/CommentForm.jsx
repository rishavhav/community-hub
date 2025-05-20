import React, { useState } from "react"

function CommentForm({ onSubmit }) {
  const [text, setText] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) return
    onSubmit(text)
    setText("")
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 flex gap-2">
      <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment..." className="flex-1 p-2 rounded bg-neutral-600 text-white" />
      <button type="submit" className="bg-blue-500 px-3 rounded text-white">
        Reply
      </button>
    </form>
  )
}

export default CommentForm
