import express from "express"
import { logoutUser, getAllUsers, loginUser, createUser, getMyProfile, updateMyProfile, deleteMyAccount } from "../controllers/userController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/create", createUser) // after stripe success
router.get("/me", protect, getMyProfile)
router.put("/me", protect, updateMyProfile)
router.delete("/me", protect, deleteMyAccount)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.get("/all", protect, getAllUsers)

export default router
