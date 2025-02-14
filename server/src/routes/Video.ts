import { Router } from "express";
import {
  uploadVideo,
  getFeed,
  addComment,
  deleteComment,
  getComments,
  getUserDislikedVideos,
  getUserLikedVideos,
  getUserVideos,
  getVideo,
  toggleLikeVideo,
  deleteVideoController,
  updateVideoDetails,
} from "@/controllers/Video";

const VideoRouter = Router();

VideoRouter.post("/upload", uploadVideo);
VideoRouter.get("/feed", getFeed);
VideoRouter.route("/video/:videoId")
  .get(getVideo)
  .put(updateVideoDetails)
  .delete(deleteVideoController);
VideoRouter.post("/toggle-like-video/:videoId", toggleLikeVideo);
VideoRouter.post("/add-comment/:videoId", addComment);
VideoRouter.delete("/delete-comment/:commentId", deleteComment);
VideoRouter.get("/get-comments/:videoId", getComments);
VideoRouter.get("/user-videos", getUserVideos);
VideoRouter.get("/user-liked-videos", getUserLikedVideos);
VideoRouter.get("/user-disliked-videos", getUserDislikedVideos);

export default VideoRouter;
