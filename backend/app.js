import express from "express"
import cors from "cors"
import stripeRoutes from "./routes/stripeRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"

const app = express()

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}

app.use(cors(corsOptions))
app.use(express.json())

app.use("/api/stripe", stripeRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/user", userRoutes)
app.use("/api/events", eventRoutes)

export default app
