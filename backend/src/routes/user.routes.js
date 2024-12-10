import express from "express";
import { searchUser, followUser, getUserProfile } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";


const router = express.Router();
router.get("/search", protectRoute, searchUser);
router.post("/follow/:userId", protectRoute, followUser);
router.get("/:userId", protectRoute, getUserProfile);

export default router;
