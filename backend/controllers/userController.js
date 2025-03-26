import User from "../models/User.js"
import bcrypt from "bcrypt"
import { generateToken } from "../utils/jwt.js"

// Create User (after Stripe payment)
export const createUser = async (req, res) => {
  try {
    const { email, password, name, plan, stripeCustomerId } = req.body

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: "User already exists" })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({ email, passwordHash, name, plan, stripeCustomerId })
    const token = generateToken({ id: user._id, email: user.email }) // include email in token

    res.status(201).json({ user, token })
  } catch (err) {
    res.status(500).json({ error: "User creation failed" })
  }
}

//login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: "Invalid email or password" })

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" })

    const token = generateToken({ id: user._id, email: user.email }) // include email in token

    res.json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        plan: user.plan,
      },
      token,
    })
  } catch (err) {
    res.status(500).json({ error: "Login failed" })
  }
}

// Get My Profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash")
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch profile" })
  }
}

// Update My Profile
export const updateMyProfile = async (req, res) => {
  try {
    const updates = req.body
    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 10)
      delete updates.password
    }

    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" })
  }
}

// Delete My Account
export const deleteMyAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.userId)
    res.json({ message: "Account deleted" })
  } catch (err) {
    res.status(500).json({ error: "Failed to delete account" })
  }
}
