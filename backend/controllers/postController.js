import Post from "../models/Post.js"
import { uploadBase64Image } from "../utils/s3Upload.js"

export const createPost = async (req, res) => {
  try {
    const { content, image, channelId } = req.body
    const author = req.userId

    if (!content || !channelId) {
      return res.status(400).json({ error: "Content and Channel ID are required" })
    }

    let imageUrl = ""
    if (image) {
      imageUrl = await uploadBase64Image(image, "community-posts")
    }

    const newPost = await Post.create({
      author,
      content,
      image: imageUrl,
      channel: channelId,
    })

    const populatedPost = await Post.findById(newPost._id).populate("author", "name profilePic")
    res.status(201).json(populatedPost)
  } catch (err) {
    console.error("Post creation error:", err)
    res.status(500).json({ error: "Failed to create post" })
  }
}

export const getPostsByChannel = async (req, res) => {
  try {
    const posts = await Post.find({ channel: req.params.channelId }).populate("author", "name email profilePic").populate("comments.user", "name email profilePic").populate("comments.replies.user", "name email profilePic").sort({ createdAt: -1 })

    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" })
  }
}

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post) return res.status(404).json({ message: "Post not found" })

    const userId = req.userId
    const index = post.likes.indexOf(userId)

    if (index === -1) {
      post.likes.push(userId)
    } else {
      post.likes.splice(index, 1)
    }

    await post.save()

    const updatedPost = await Post.findById(post._id).populate("author", "name profilePic").populate("comments.user", "name profilePic").populate("comments.replies.user", "name profilePic")

    res.json(updatedPost)
  } catch (err) {
    console.error("Like error:", err)
    res.status(500).json({ error: "Failed to like/unlike post" })
  }
}

export const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    post.comments.push({ user: req.userId, comment: req.body.comment })
    await post.save()

    const updated = await Post.findById(post._id).populate("author", "name profilePic").populate("comments.user", "name profilePic").populate("comments.replies.user", "name profilePic")

    res.json(updated)
  } catch (err) {
    res.status(500).json({ error: "Failed to comment on post" })
  }
}

export const replyToComment = async (req, res) => {
  try {
    const { commentIndex, reply } = req.body
    const post = await Post.findById(req.params.id)

    post.comments[commentIndex].replies.push({ user: req.userId, reply })
    await post.save()

    const updatedPost = await Post.findById(post._id).populate("author", "name profilePic").populate("comments.user", "name profilePic").populate("comments.replies.user", "name profilePic")

    res.json(updatedPost)
  } catch (err) {
    res.status(500).json({ error: "Reply error" })
  }
}
