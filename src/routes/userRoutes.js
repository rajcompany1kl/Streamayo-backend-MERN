import { Router } from "express";
import * as userController from "../controllers/userController.js";
import clerkAuth from "../middlewares/clerkAuth.js";

const router = Router();

// /api/users/:id
router.get("/:id", clerkAuth, userController.getUserById);

export default router;
