import { z } from "zod";

const videoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  videoSrc: z.string().min(1, "Video source URL is required"),
  thumbnailUrl: z.string().min(1, "Thumbnail URL is required"),
  tags: z.array(z.string()).nonempty("At least one tag is required"),
});

export const validateVideoSchema = (data: any) => {
  const parsedData = videoSchema.safeParse(data);
  if (!parsedData.success) {
    return {
      success: false,
      errors: parsedData.error.errors.map((err) => err.message),
    };
  }
  return { success: true, data: parsedData.data };
};
