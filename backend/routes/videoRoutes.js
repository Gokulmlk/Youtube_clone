import express from "express";
import {
  getAllVideos,
  getVideoById,
  getVideosByChannel,
  createVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
} from "../controllers/videoController.js";
import {
  getComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/commentController.js"
import { protect, optionalAuth } from "../middleware/authMiddleware.js";
import {
  validateVideo,
  validateComment,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

//  Video Routes 

// Public
router.get("/", getAllVideos);
router.get("/channel/:channelId", getVideosByChannel);
router.get("/:id", optionalAuth, getVideoById);

// Protected
router.post("/", protect, validateVideo, createVideo);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);
router.put("/:id/like", protect, likeVideo);
router.put("/:id/dislike", protect, dislikeVideo);

// Comment Routes (nested under videos) 

// Public
router.get("/:videoId/comments", getComments);

// Protected
router.post("/:videoId/comments", protect, validateComment, addComment);
router.put("/:videoId/comments/:commentId", protect, updateComment);
router.delete("/:videoId/comments/:commentId", protect, deleteComment);

export default router;