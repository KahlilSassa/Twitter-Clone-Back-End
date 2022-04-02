const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      max: 500,
    },
    img: {
      type: String,
    },
    retweets: {
      type: Array,
      default: [],
    },
    likes: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);