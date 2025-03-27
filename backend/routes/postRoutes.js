import express from "express"
import { createPost, getPostsByChannel, likePost, commentOnPost, replyToComment } from "../controllers/postController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/channel/:channelId", getPostsByChannel)
router.post("/", protect, createPost)
router.post("/:id/like", protect, likePost)
router.post("/:id/comment", protect, commentOnPost)
router.post("/:id/reply", protect, replyToComment)

export default router
