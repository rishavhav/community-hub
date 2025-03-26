// server.js
import dotenv from "dotenv"
dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env" })

import app from "./app.js"
import connectDB from "./config/db.js"

connectDB()

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})
