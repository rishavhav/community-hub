import express from "express"
import cors from "cors"
import stripeRoutes from "./routes/stripeRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import eventRoutes from "./routes/eventRoutes.js"
import channelRoutes from "./routes/channelRoutes.js"
import chatRoutes from "./routes/chatRoutes.js"
import { v2 as cloudinary } from "cloudinary"

const app = express()

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
}

app.use(cors(corsOptions))

app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ extended: true, limit: "50mb" }))

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use("/api/stripe", stripeRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/user", userRoutes)
app.use("/api/events", eventRoutes)
app.use("/api/channels", channelRoutes)
app.use("/api/chats", chatRoutes)

export default app
