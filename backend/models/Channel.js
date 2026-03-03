import mongoose from "mongoose";

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: [true, "Channel name is required"],
      trim: true,
      minlength: [3, "Channel name must be at least 3 characters"],
      maxlength: [100, "Channel name cannot exceed 100 characters"],
    },
    handle: {
      type: String,
      unique: true,
      trim: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      default: "",
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    channelBanner: {
      type: String,
      default: "",
    },
    channelAvatar: {
      type: String,
      default: "",
    },
    subscribers: {
      type: Number,
      default: 0,
    },
    subscribersList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    videos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Auto-generate handle before saving
channelSchema.pre("save", function (next) {
  if (!this.handle) {
    const randomSuffix = Math.random().toString(36).substring(2, 6);
    this.handle =
      "@" +
      this.channelName
        .toLowerCase()
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "") +
      "-" +
      randomSuffix;
  }
  next();
});

const Channel = mongoose.model("Channel", channelSchema);
export default Channel;