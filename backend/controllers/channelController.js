import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

// @desc    Create a new channel
// @route   POST /api/channels
// @access  Private
export const createChannel = async (req, res, next) => {
  try {
    const { channelName, description, channelBanner, channelAvatar } = req.body;

    // Check if user already owns a channel with the same name
    const existingChannel = await Channel.findOne({
      owner: req.user._id,
      channelName,
    });

    if (existingChannel) {
      return res.status(400).json({
        success: false,
        message: "You already have a channel with this name",
      });
    }

    const channel = await Channel.create({
      channelName,
      description: description || "",
      channelBanner: channelBanner || "",
      channelAvatar:
        channelAvatar ||
        `https://ui-avatars.com/api/?name=${channelName}&background=random&size=200`,
      owner: req.user._id,
    });

    // Add channel to user's channels list
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: channel._id },
    });

    const populatedChannel = await Channel.findById(channel._id).populate(
      "owner",
      "username avatar email"
    );

    res.status(201).json({
      success: true,
      message: "Channel created successfully",
      channel: populatedChannel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all channels
// @route   GET /api/channels
// @access  Public
export const getAllChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find()
      .populate("owner", "username avatar")
      .select("-subscribersList")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: channels.length,
      channels,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single channel by ID
// @route   GET /api/channels/:id
// @access  Public
export const getChannelById = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate("owner", "username avatar email")
      .populate({
        path: "videos",
        populate: {
          path: "uploader",
          select: "username avatar",
        },
      });

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    res.status(200).json({
      success: true,
      channel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get channels owned by logged-in user
// @route   GET /api/channels/my-channels
// @access  Private
export const getMyChannels = async (req, res, next) => {
  try {
    const channels = await Channel.find({ owner: req.user._id })
      .populate({
        path: "videos",
        select: "title thumbnailUrl views likes dislikes uploadDate category",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: channels.length,
      channels,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update channel
// @route   PUT /api/channels/:id
// @access  Private (owner only)
export const updateChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    // Check ownership
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this channel",
      });
    }

    const { channelName, description, channelBanner, channelAvatar } = req.body;
    const updateFields = {};

    if (channelName) updateFields.channelName = channelName;
    if (description !== undefined) updateFields.description = description;
    if (channelBanner !== undefined) updateFields.channelBanner = channelBanner;
    if (channelAvatar !== undefined) updateFields.channelAvatar = channelAvatar;

    const updatedChannel = await Channel.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate("owner", "username avatar");

    res.status(200).json({
      success: true,
      message: "Channel updated successfully",
      channel: updatedChannel,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete channel
// @route   DELETE /api/channels/:id
// @access  Private (owner only)
export const deleteChannel = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this channel",
      });
    }

    // Delete all videos belonging to this channel
    await Video.deleteMany({ channelId: req.params.id });

    // Remove channel from user's list
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { channels: req.params.id },
    });

    await Channel.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Channel and all its videos deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Subscribe / Unsubscribe to a channel
// @route   PUT /api/channels/:id/subscribe
// @access  Private
export const toggleSubscribe = async (req, res, next) => {
  try {
    const channel = await Channel.findById(req.params.id);

    if (!channel) {
      return res.status(404).json({
        success: false,
        message: "Channel not found",
      });
    }

    // Can't subscribe to your own channel
    if (channel.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot subscribe to your own channel",
      });
    }

    const isSubscribed = channel.subscribersList.includes(req.user._id);

    if (isSubscribed) {
      channel.subscribersList.pull(req.user._id);
      channel.subscribers = Math.max(0, channel.subscribers - 1);
    } else {
      channel.subscribersList.push(req.user._id);
      channel.subscribers += 1;
    }

    await channel.save();

    res.status(200).json({
      success: true,
      message: isSubscribed ? "Unsubscribed successfully" : "Subscribed successfully",
      subscribed: !isSubscribed,
      subscribers: channel.subscribers,
    });
  } catch (error) {
    next(error);
  }
};