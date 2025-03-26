import Post from "../models/Post.js"

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body
    const author = req.userId

    const post = await Post.create({ author, content, image })
    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" })
  }
}

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author", "email name").sort({ createdAt: -1 })
    res.json(posts)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" })
  }
}

export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    if (!post.likes.includes(req.userId)) {
      post.likes.push(req.userId)
    } else {
      post.likes = post.likes.filter((id) => id.toString() !== req.userId)
    }
    await post.save()
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: "Failed to like/unlike post" })
  }
}

export const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
    post.comments.push({ user: req.userId, comment: req.body.comment })
    await post.save()
    res.json(post)
  } catch (err) {
    res.status(500).json({ error: "Failed to comment on post" })
  }
}
