import express from 'express';
import multer from 'multer';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { uploadPhoto, uploadVideo } from "../utils/upload.js";

const router = express.Router();

router.post(
  "/",
  protectRoute,
  (req, res, next) => {
    const upload = multer().fields([{ name: "image" }, { name: "video" }]);
    upload(req, res, (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: "Error uploading files", error: err.message });
      }
      next();
    });
  },
  createPost
);

// Create a new post
router.post('/', protectRoute, createPost);

// Get all posts
router.get('/', getPosts);

// Get a single post by ID
router.get('/:id', getPostById);

// Update a post by ID
router.patch('/:id', protectRoute, updatePost);

// Delete a post by ID
router.delete('/:id', protectRoute, deletePost);

export default router;