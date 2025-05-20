import React, { useState } from "react"

function PostForm({ onSubmit }) {
  const [content, setContent] = useState("")
  const [imageBase64, setImageBase64] = useState(null)
  const [imageName, setImageName] = useState("")

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => setImageBase64(reader.result)
      reader.readAsDataURL(file)
      setImageName(file.name)
    } else {
      setImageBase64(null)
      setImageName("")
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!content.trim() && !imageBase64) return // prevent empty posts

    onSubmit({ content, image: imageBase64 })
    setContent("")
    setImageBase64(null)
    setImageName("")
  }

  return (
    <form onSubmit={handleSubmit} className="bg-neutral-800 p-4 rounded mb-6">
      <textarea placeholder="What's on your mind?" value={content} onChange={(e) => setContent(e.target.value)} className="w-full p-2 bg-neutral-700 rounded text-white mb-2" />

      {/* Image Upload Button */}
      <div className="mb-4 flex items-center">
        <label htmlFor="image-upload" className="cursor-pointer inline-block bg-neutral-700 text-gray-200 px-4 py-2 rounded hover:bg-neutral-600 transition">
          📷 {imageName ? "Change Image" : "Upload Image"}
        </label>
        <input id="image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
        {imageName && (
          <p className="text-sm text-gray-400 mt-1 ml-2">
            Selected: <span className="text-white">{imageName}</span>
          </p>
        )}
      </div>

      <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">
        Post
      </button>
    </form>
  )
}

export default PostForm
