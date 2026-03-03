import Video from "../models/Video.js";

// @desc    Get all comments for a video
// @route   GET /api/videos/:videoId/comments
// @access  Public
export const getComments = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId).populate(
      "comments.userId",
      "username avatar"
    );

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Sort comments newest first
    const comments = [...video.comments].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a comment to a video
// @route   POST /api/videos/:videoId/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const newComment = {
      userId: req.user._id,
      text: text.trim(),
    };

    video.comments.push(newComment);
    await video.save();

    // Populate the newly added comment
    const savedVideo = await Video.findById(req.params.videoId).populate(
      "comments.userId",
      "username avatar"
    );

    const addedComment = savedVideo.comments[savedVideo.comments.length - 1];

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: addedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a comment
// @route   PUT /api/videos/:videoId/comments/:commentId
// @access  Private (comment owner only)
export const updateComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
      });
    }

    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Find the specific comment
    const comment = video.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check ownership
    if (comment.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this comment",
      });
    }

    comment.text = text.trim();
    await video.save();

    const updatedVideo = await Video.findById(req.params.videoId).populate(
      "comments.userId",
      "username avatar"
    );

    const updatedComment = updatedVideo.comments.id(req.params.commentId);

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a comment
// @route   DELETE /api/videos/:videoId/comments/:commentId
// @access  Private (comment owner or video uploader)
export const deleteComment = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.videoId);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const comment = video.comments.id(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Allow deletion by comment owner OR video uploader
    const isCommentOwner = comment.userId.toString() === req.user._id.toString();
    const isVideoOwner = video.uploader.toString() === req.user._id.toString();

    if (!isCommentOwner && !isVideoOwner) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    video.comments.pull({ _id: req.params.commentId });
    await video.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};