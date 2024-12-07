import express from "express";
import { searchUser } from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();
router.get("/search", protectRoute, searchUser);

export default router;
