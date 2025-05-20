import React, { useState } from "react"

function ChannelForm({ onCreate }) {
  const [channelName, setChannelName] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (channelName.trim()) {
      onCreate(channelName.trim())
      setChannelName("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input type="text" value={channelName} onChange={(e) => setChannelName(e.target.value)} placeholder="New channel name" className="px-3 py-1 rounded bg-neutral-700" />
      <button type="submit" className="bg-green-600 px-4 rounded">
        Create
      </button>
    </form>
  )
}

export default ChannelForm
