import { Router } from "express";
import * as videoController from "../controllers/videoController.js";
import clerkAuth from "../middlewares/clerkAuth.js";

const router = Router();

// 🎥 Public routes
router.get("/", videoController.getAllVideos);
// 🧾 Cloudinary signature
router.get("/upload-signature", clerkAuth, videoController.getUploadSignature);

router.get("/limited-videos", videoController.getLimitedVideos);


router.get("/user/:userId", videoController.getVideosByUserId);

// 🧾 Upload (metadata only)
router.post("/cloud/upload", clerkAuth, videoController.uploadToCloud);


// 💾 MyList operations
router.get("/mylist/:userId", clerkAuth, videoController.savedVideos);
router.get("/save-status/:videoId/:userId", clerkAuth, videoController.getSaveStatus);
router.post("/save/:videoId/:userId", clerkAuth, videoController.saveVideo);

// 👥 Subscriptions
router.get("/subscribe/:creatorId/:userId/:checking", clerkAuth, videoController.subscribe);
router.get("/subscribed-vids/:userId", clerkAuth, videoController.subscribedVids);

// 💬 Comments
router.get("/comments/:videoId", videoController.getComments);
router.post("/add-comment/:videoId/:userId", clerkAuth, videoController.addComment);
router.get("/:id", videoController.getVideoById);

router.get("/search/:query", videoController.searchVideos); 


export default router;
