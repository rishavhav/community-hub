import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: String,
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
        replies: [
          {
            user: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "User",
            },
            reply: String,
            createdAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.model("Post", postSchema)
