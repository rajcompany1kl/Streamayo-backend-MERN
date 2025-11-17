import { Router } from "express";
import userRoutes from "./userRoutes.js";
import videoRoutes from "./videoRoutes.js";
import likesRoutes from "./likesRoutes.js";
import liveRoutes from "./liveRoutes.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/videos", videoRoutes);
router.use("/likes", likesRoutes);
router.use("/lives", liveRoutes);

router.get("/", (req, res) => res.json({ message: "API Root" }));

export default router;
