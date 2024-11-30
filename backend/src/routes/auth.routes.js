import express from "express";
import {
  checkRoute,
  loginRoute,
  logoutRoute,
  signupRoute,
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


export default router;
