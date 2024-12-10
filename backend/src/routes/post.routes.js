import express from 'express';
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

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