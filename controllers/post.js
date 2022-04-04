const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/", async (req, res) => {
  // console.log(req.body);
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//update a post
router.put("/:id/update", async (req, res) => {
  console.log(req.body, 'update')
  try {
    const post = await Post.findOneAndUpdate({_id: req.params.id} , req.body, {new: true});
    console.log(post)
    if (post.userId === req.body.userId) {
      // let p = await post.updateOne({ $set: req.body });
      if (post) {
        res.status(200).json("this post has been updated.");
      }
    } else {
      res.status(403).json("Only your post can be updated.");
    }
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//delete a post
router.delete("/:id/delete", async (req, res) => {
  console.log(req.body);
  try {
    const post = await Post.findById(req.params.id);
    console.log(post)

    if (post.userId === req.body.userId) {
      let p = await post.deleteOne();
      if (p) {
        res.status(200).json("this post has been deleted.");
      }
    } else {
      res.status(403).json("only your post can be deleted.");
    }
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
});

//Like and disliking a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("This post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("This post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const post = await Post.find({});
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all feed posts
router.get("/timeline/:userId", async (req, res) => {
  console.log(req.params);
  try {
    const currentUser = await User.findById(req.params.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    // const friendPosts = await Promise.all(
    //   currentUser.followings.map((friendId) => {
    //     return Post.find({ userId: friendId });
    //   })
    // );
    console.log(userPosts);
    res.status(200).json(userPosts);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//get user feed posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ userId: user._id });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
