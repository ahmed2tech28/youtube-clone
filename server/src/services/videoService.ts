import { primsaClient } from "@/utils/prismaClient";

export const createVideo = async (data: any, userId: string) => {
  return await primsaClient.video.create({
    data: { ...data, userId },
  });
};

export const getVideos = async (cursor?: string, limit = 10) => {
  const videos = await primsaClient.video.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      User: { select: { handle: true, profileImage: true } },
    },
  });
  return {
    videos,
    nextCursor: videos.length === limit ? videos[limit - 1].id : null,
  };
};

export const findVideoById = async (videoId: string) => {
  return await primsaClient.video.findUnique({
    where: { id: videoId },
    include: { User: { select: { handle: true, profileImage: true } } },
  });
};

export const updateVideo = async (videoId: string, data: any) => {
  return await primsaClient.video.update({
    where: { id: videoId },
    data,
  });
};

export const deleteVideo = async (videoId: string) => {
  return await primsaClient.video.delete({ where: { id: videoId } });
};

export const toggleLike = async (userId: string, videoId: string) => {
  const existingLike = await primsaClient.like.findUnique({
    where: { userId_videoId: { userId, videoId } },
  });

  if (existingLike) {
    await primsaClient.like.delete({ where: { id: existingLike.id } });
    return { liked: false };
  }

  await primsaClient.like.create({ data: { userId, videoId } });
  return { liked: true };
};

export const createComment = async (
  userId: string,
  videoId: string,
  content: string,
  parentId?: string
) => {
  return await primsaClient.comment.create({
    data: { userId, videoId, content, parentId },
  });
};

export const removeComment = async (userId: string, commentId: string) => {
  const comment = await primsaClient.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment || comment.userId !== userId) return false;

  await primsaClient.comment.delete({
    where: { id: commentId },
  });

  return true;
};

export const fetchComments = async (videoId: string) => {
  return await primsaClient.comment.findMany({
    where: { videoId },
    include: {
      user: { select: { handle: true, profileImage: true } },
      replies: true,
    },
    orderBy: { createdAt: "asc" },
  });
};

export const fetchUserVideos = async (userId: string) => {
  return await primsaClient.video.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

export const fetchUserLikedVideos = async (userId: string) => {
  return await primsaClient.video.findMany({
    where: {
      Like: { some: { userId } },
    },
    include: {
      User: { select: { handle: true, profileImage: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const fetchUserDislikedVideos = async (userId: string) => {
  return await primsaClient.video.findMany({
    where: {
      Like: { none: { userId } },
    },
    include: {
      User: { select: { handle: true, profileImage: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const searchVideosService = async (query: string, cursor?: string) => {
  const limit = 10;

  return await primsaClient.video.findMany({
    take: limit,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    orderBy: { createdAt: "desc" },
    where: {
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          tags: {
            string_contains: query,
          },
        },
      ],
    },
    include: {
      User: {
        select: {
          handle: true,
          profileImage: true,
        },
      },
    },
  });
};
