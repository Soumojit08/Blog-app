import express from "express";
import {
  checkRoute,
  followerRoute,
  followingRoute,
  followRoute,
  loginRoute,
  logoutRoute,
  signupRoute,
  unfollowRoute,
  updateProfile,
  updateProfilePhoto,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/upload.js";


const router = express.Router();

router.post("/signup", signupRoute);
router.post("/login", loginRoute);
router.post("/logout", logoutRoute);

router.get("/check", protectRoute, checkRoute);
router.patch("/profile", protectRoute, updateProfile);

router.patch(
  "/profile/photo",
  protectRoute,
  upload.single("photo"),
  updateProfilePhoto
);

router.post("/follow/:id", protectRoute, followRoute);
router.post("/unfollow/:id", protectRoute, unfollowRoute);

router.get("/followers", protectRoute, followerRoute);
router.get("/following", protectRoute, followingRoute);


export default router;
