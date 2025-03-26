import express from "express"
import { createPost, getAllPosts, likePost, commentOnPost } from "../controllers/postController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", protect, createPost)
router.get("/", getAllPosts)
router.post("/:id/like", protect, likePost)
router.post("/:id/comment", protect, commentOnPost)

export default router
