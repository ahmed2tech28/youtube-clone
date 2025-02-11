import { RequestHandler } from "express";
import { primsaClient } from "@/utils/prismaClient";

export const uploadVideo: RequestHandler = async (req, res, next) => {};

export const getFeed: RequestHandler = async (req, res, next) => {
  try {
    const { cursor } = req.query;
    const limit = 10;

    const videos = await primsaClient.video.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor as string } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        User: {
          select: {
            handle: true,
            profileImage: true,
          },
        },
      },
    });

    const nextCursor = videos.length === limit ? videos[limit - 1].id : null;

    res.status(200).json({
      videos,
      nextCursor,
    });
  } catch (error) {
    next(error);
  }
};

export const searchVideos: RequestHandler = async (req, res, next) => {};

export const getVideo: RequestHandler = async (req, res, next) => {};

export const updateVideo: RequestHandler = async (req, res, next) => {};

export const patchVideo: RequestHandler = async (req, res, next) => {};

export const deleteVideo: RequestHandler = async (req, res, next) => {};

export const toggleLikeVideo: RequestHandler = async (req, res, next) => {};

export const addComment: RequestHandler = async (req, res, next) => {};

export const deleteComment: RequestHandler = async (req, res, next) => {};

export const getComments: RequestHandler = async (req, res, next) => {};

export const getUserVideos: RequestHandler = async (req, res, next) => {};

export const getUserLikedVideos: RequestHandler = async (req, res, next) => {};

export const getUserDislikedVideos: RequestHandler = async (
  req,
  res,
  next
) => {};
