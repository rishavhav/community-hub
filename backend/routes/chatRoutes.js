import express from "express"
import { getChatsForAdmin, getChatWithUser } from "../controllers/chatController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/admin", protect, getChatsForAdmin)
router.get("/:userId", protect, getChatWithUser)

export default router
