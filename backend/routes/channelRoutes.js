// routes/channelRoutes.js
import express from "express"
import { createChannel, getChannels } from "../controllers/channelController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/", protect, createChannel) // Admin-only, but frontend checks this
router.get("/", getChannels)

export default router
