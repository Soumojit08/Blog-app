import Post from "../models/post.model.js";

// Create a new post
export const createPost = async (req, res) => {
  console.log("Request Body:", req.body);
  console.log("Uploaded File:", req.files);

  try {
    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      author: req.user._id,
      tags: req.body.tags || [],
      image: req.files.image ? req.files.image[0].path : null, // Access image correctly
      video: req.files.video ? req.files.video[0].path : null, // Access video correctly
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    console.error("Error creating post:", error); // Log the error for debugging
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

// Get all posts or filter by author
export const getPosts = async (req, res) => {
  try {
    const authorId = req.query.author; // Get author ID from query parameters
    const posts = authorId
      ? await Post.find({ author: authorId }).populate("author", "fullName profilePhoto").sort({ createdAt: -1 })
      : await Post.find().populate("author", "fullName profilePhoto").sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};

// Get a single post by ID
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "fullName profilePhoto");
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error: error.message });
  }
};

// Update a post by ID
export const updatePost = async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

// Delete a post by ID
export const deletePost = async (req, res) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};
