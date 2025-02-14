import { RequestHandler } from "express";
import { validateVideoSchema } from "@/helpers/ValidateVideoSchema";
import {
  createVideo,
  getVideos,
  findVideoById,
  updateVideo,
  deleteVideo,
  toggleLike,
  createComment,
  removeComment,
  fetchComments,
  fetchUserVideos,
  fetchUserLikedVideos,
  fetchUserDislikedVideos,
  searchVideosService,
} from "@/services/videoService";

export const uploadVideo: RequestHandler = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    const validationResult = validateVideoSchema(req.body);
    if (!validationResult.success) {
      res.status(400).json({ success: false, errors: validationResult.errors });
      return;
    }
    await createVideo(validationResult.data!, userId!);
    res
      .status(201)
      .json({ success: true, message: "Video uploaded successfully" });
  } catch (error) {
    next(error);
  }
};

export const getFeed: RequestHandler = async (req, res, next) => {
  try {
    const { cursor } = req.query;
    const { videos, nextCursor } = await getVideos(cursor as string);
    res.status(200).json({ videos, nextCursor });
  } catch (error) {
    next(error);
  }
};

export const getVideo: RequestHandler = async (req, res, next) => {
  try {
    const video = await findVideoById(req.params.videoId);
    if (!video) {
      res.status(404).json({ success: false, error: "Video not found" });
      return;
    }

    res.status(200).json({ success: true, video });
  } catch (error) {
    next(error);
  }
};

export const updateVideoDetails: RequestHandler = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req?.user?.id;
    const video = await findVideoById(videoId);

    if (!video || video.userId !== userId) {
      res.status(404).json({ success: false, error: "Video not found" });
      return;
    }

    const validationResult = validateVideoSchema(req.body);
    if (!validationResult.success) {
      res.status(400).json({ success: false, errors: validationResult.errors });
      return;
    }

    await updateVideo(videoId, validationResult.data!);
    res
      .status(200)
      .json({ success: true, message: "Video updated successfully" });
  } catch (error) {
    next(error);
  }
};

export const deleteVideoController: RequestHandler = async (req, res, next) => {
  try {
    const { videoId } = req.params;
    const userId = req?.user?.id;
    const video = await findVideoById(videoId);

    if (!video || video.userId !== userId) {
      res.status(404).json({ success: false, error: "Video not found" });
      return;
    }

    await deleteVideo(videoId);
    res
      .status(200)
      .json({ success: true, message: "Video deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const toggleLikeVideo: RequestHandler = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    const { videoId } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    if (!videoId) {
      res.status(400).json({ success: false, message: "Video ID is required" });
      return;
    }
    const result = await toggleLike(userId, videoId);
    res.status(200).json({
      success: true,
      message: result.liked ? "Video liked" : "Video unliked",
      liked: result.liked,
    });
  } catch (error) {
    next(error);
  }
};

export const addComment: RequestHandler = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    const { videoId, content, parentId } = req.body;

    if (!userId || !videoId || !content) {
      res.status(400).json({ success: false, message: "Missing fields" });
      return;
    }

    const comment = await createComment(userId, videoId, content, parentId);
    res.status(201).json({ success: true, comment });
  } catch (error) {
    next(error);
  }
};

export const deleteComment: RequestHandler = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    const { commentId } = req.params;

    if (!userId || !commentId) {
      res.status(400).json({ success: false, message: "Missing fields" });
      return;
    }

    const deleted = await removeComment(userId, commentId);
    if (!deleted) {
      res
        .status(403)
        .json({ success: false, message: "Unauthorized or not found" });
      return;
    }

    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    next(error);
  }
};

export const getComments: RequestHandler = async (req, res, next) => {
  try {
    const { videoId } = req.params;

    if (!videoId) {
      res.status(400).json({ success: false, message: "Video ID is required" });
      return;
    }

    const comments = await fetchComments(videoId);
    res.status(200).json({ success: true, comments });
  } catch (error) {
    next(error);
  }
};

export const getUserVideos: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const videos = await fetchUserVideos(userId);
    res.status(200).json({ success: true, videos });
  } catch (error) {
    next(error);
  }
};

export const getUserLikedVideos: RequestHandler = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const videos = await fetchUserLikedVideos(userId);
    res.status(200).json({ success: true, videos });
  } catch (error) {
    next(error);
  }
};

export const getUserDislikedVideos: RequestHandler = async (req, res, next) => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const videos = await fetchUserDislikedVideos(userId);
    res.status(200).json({ success: true, videos });
  } catch (error) {
    next(error);
  }
};

export const searchVideos: RequestHandler = async (req, res, next) => {
  try {
    const { query, cursor } = req.query;

    if (!query || typeof query !== "string") {
      res
        .status(400)
        .json({ success: false, error: "Query parameter is required" });
      return;
    }

    const videos = await searchVideosService(query, cursor as string);
    const nextCursor = videos.length === 10 ? videos[9].id : null;

    res.status(200).json({ videos, nextCursor });
  } catch (error) {
    next(error);
  }
};
