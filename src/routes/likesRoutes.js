import { Router } from "express";
import * as likesController from "../controllers/likesController.js";
import clerkAuth from "../middlewares/clerkAuth.js";

const router = Router();

router.get("/videos/:userId", clerkAuth, likesController.getLikedVideos);

// 👍 Like / Dislike a video
router.post("/video/:videoId/:videoOwnerId", clerkAuth, likesController.likeVideo);
router.post("/video/dislike/:videoId/:videoOwnerId", clerkAuth, likesController.dislikeVideo);

// ❤️ Get like status
router.get("/:videoId/:userId", clerkAuth, likesController.getLikeStatus);

// 🧾 Fetch all liked videos of a user

export default router;
