const mongoose = require("mongoose");

// Define the schema for comments with timestamps
const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt
  }
);

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    discription: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    video: {
      type: String,
    },
    likes: {
      type: Number,
      default: 0,
    },
    liked: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [CommentSchema],
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt
  }
);

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;
