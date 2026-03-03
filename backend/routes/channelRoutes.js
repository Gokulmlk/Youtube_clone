import express from "express";
import {
  createChannel,
  getAllChannels,
  getChannelById,
  getMyChannels,
  updateChannel,
  deleteChannel,
  toggleSubscribe,
} from "../controllers/channelController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validateChannel } from "../middleware/validationMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllChannels);
router.get("/:id", getChannelById);

// Protected routes
router.post("/", protect, validateChannel, createChannel);
router.get("/user/my-channels", protect, getMyChannels);
router.put("/:id", protect, updateChannel);
router.delete("/:id", protect, deleteChannel);
router.put("/:id/subscribe", protect, toggleSubscribe);

export default router;