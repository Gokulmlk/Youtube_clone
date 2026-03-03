import Video from "../models/Video.js";
import Channel from "../models/Channel.js";

// @desc    Get all videos (with search & filter)
// @route   GET /api/videos
// @access  Public
export const getAllVideos = async (req, res, next) => {
  try {
    const { search, category, sort, page = 1, limit = 20 } = req.query;

    const query = { isPublic: true };

    // Search by title
    if (search && search.trim()) {
      query.title = { $regex: search.trim(), $options: "i" };
    }

    // Filter by category
    if (category && category !== "All") {
      query.category = category;
    }

    // Sort options
    let sortOption = { uploadDate: -1 }; // default: latest
    if (sort === "views") sortOption = { views: -1 };
    if (sort === "likes") sortOption = { likes: -1 };
    if (sort === "oldest") sortOption = { uploadDate: 1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [videos, total] = await Promise.all([
      Video.find(query)
        .populate("channelId", "channelName channelAvatar handle subscribers")
        .populate("uploader", "username avatar")
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Video.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: videos.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      videos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single video by ID (also increments views)
// @route   GET /api/videos/:id
// @access  Public
export const getVideoById = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("channelId", "channelName channelAvatar handle subscribers subscribersList")
      .populate("uploader", "username avatar")
      .populate("comments.userId", "username avatar");

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    // Increment views
    video.views += 1;
    await video.save();

    res.status(200).json({
      success: true,
      video,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get videos by channel ID
// @route   GET /api/videos/channel/:channelId
// @access  Public
export const getVideosByChannel = async (req, res, next) => {
  try {
    const { sort } = req.query;

    let sortOption = { uploadDate: -1 };
    if (sort === "popular") sortOption = { views: -1 };
    if (sort === "oldest") sortOption = { uploadDate: 1 };

    const videos = await Video.find({ channelId: req.params.channelId, isPublic: true })
      .populate("channelId", "channelName channelAvatar handle")
      .populate("uploader", "username avatar")
      .sort(sortOption);

    res.status(200).json({
      success: true,
      count: videos.length,
      videos,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new video
// @route   POST /api/videos
// @access  Private
export const createVideo = async (req, res, next) => {
  try {
    const {
      title,
      description,
      thumbnailUrl,
      videoUrl,
      channelId,
      category,
      duration,
    } = req.body;

    // Verify channel exists and belongs to user
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to upload to this channel",
      });
    }

    const video = await Video.create({
      title,
      description: description || "",
      thumbnailUrl:
        thumbnailUrl ||
        `https://picsum.photos/seed/${Date.now()}/640/360`,
      videoUrl,
      channelId,
      uploader: req.user._id,
      category: category || "Web Development",
      duration: duration || "0:00",
    });

    // Add video to channel's videos list
    await Channel.findByIdAndUpdate(channelId, {
      $push: { videos: video._id },
    });

    const populatedVideo = await Video.findById(video._id)
      .populate("channelId", "channelName channelAvatar handle")
      .populate("uploader", "username avatar");

    res.status(201).json({
      success: true,
      message: "Video uploaded successfully",
      video: populatedVideo,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update video
// @route   PUT /api/videos/:id
// @access  Private (uploader only)
export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this video",
      });
    }

    const { title, description, thumbnailUrl, category, videoUrl, isPublic, duration } = req.body;
    const updateFields = {};

    if (title) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (thumbnailUrl !== undefined) updateFields.thumbnailUrl = thumbnailUrl;
    if (category) updateFields.category = category;
    if (videoUrl) updateFields.videoUrl = videoUrl;
    if (isPublic !== undefined) updateFields.isPublic = isPublic;
    if (duration) updateFields.duration = duration;

    const updatedVideo = await Video.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    )
      .populate("channelId", "channelName channelAvatar handle")
      .populate("uploader", "username avatar");

    res.status(200).json({
      success: true,
      message: "Video updated successfully",
      video: updatedVideo,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete video
// @route   DELETE /api/videos/:id
// @access  Private (uploader only)
export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    if (video.uploader.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this video",
      });
    }

    // Remove video from channel's list
    await Channel.findByIdAndUpdate(video.channelId, {
      $pull: { videos: req.params.id },
    });

    await Video.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a video
// @route   PUT /api/videos/:id/like
// @access  Private
export const likeVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const userId = req.user._id;
    const alreadyLiked = video.likes.includes(userId);
    const alreadyDisliked = video.dislikes.includes(userId);

    if (alreadyLiked) {
      // Toggle off like
      video.likes.pull(userId);
    } else {
      // Add like, remove dislike if present
      video.likes.push(userId);
      if (alreadyDisliked) {
        video.dislikes.pull(userId);
      }
    }

    await video.save();

    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Like removed" : "Video liked",
      liked: !alreadyLiked,
      likeCount: video.likes.length,
      dislikeCount: video.dislikes.length,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Dislike a video
// @route   PUT /api/videos/:id/dislike
// @access  Private
export const dislikeVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const userId = req.user._id;
    const alreadyDisliked = video.dislikes.includes(userId);
    const alreadyLiked = video.likes.includes(userId);

    if (alreadyDisliked) {
      // Toggle off dislike
      video.dislikes.pull(userId);
    } else {
      // Add dislike, remove like if present
      video.dislikes.push(userId);
      if (alreadyLiked) {
        video.likes.pull(userId);
      }
    }

    await video.save();

    res.status(200).json({
      success: true,
      message: alreadyDisliked ? "Dislike removed" : "Video disliked",
      disliked: !alreadyDisliked,
      likeCount: video.likes.length,
      dislikeCount: video.dislikes.length,
    });
  } catch (error) {
    next(error);
  }
};