import express from "express"
import { createEvent, getEvents, deleteEvent } from "../controllers/eventController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/add", protect, createEvent)
router.get("/", getEvents)
router.delete("/delete/:id", protect, deleteEvent) // ✅ THIS LINE is needed

export default router
