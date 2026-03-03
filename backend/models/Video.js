import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Video title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      default: "",
      maxlength: [5000, "Description cannot exceed 5000 characters"],
    },
    thumbnailUrl: {
      type: String,
      default: "",
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
      required: true,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: [
        "All",
        "Web Development",
        "JavaScript",
        "Data Structures",
        "Server",
        "Music",
        "Information Technology",
        "Relaxation",
        "Gaming",
        "Live",
        "Spring Framework",
        "React",
        "Python",
        "Machine Learning",
      ],
      default: "Web Development",
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [commentSchema],
    uploadDate: {
      type: Date,
      default: Date.now,
    },
    duration: {
      type: String,
      default: "0:00",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for like count
videoSchema.virtual("likeCount").get(function () {
  return this.likes.length;
});

// Virtual for dislike count
videoSchema.virtual("dislikeCount").get(function () {
  return this.dislikes.length;
});

videoSchema.set("toJSON", { virtuals: true });
videoSchema.set("toObject", { virtuals: true });

const Video = mongoose.model("Video", videoSchema);
export default Video;