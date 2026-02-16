import mongoose from "mongoose";
import { z } from "zod";

const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  });


export const createPostSchema = z.object({
  title: z
    .string({
      message: "Title is required",
    })
    .trim()
    .min(1, "Title cannot be empty"),

  content: z
    .string({
      message: "Content is required",
    })
    .trim()
    .min(1, "Content cannot be empty"),

  tags: z
    .array(z.string().trim().min(1, "Tag cannot be empty"))
    .optional()
    .default([]),
});


export const updatePostSchema = z
  .object({
    postId: objectIdSchema,

    title: z.string().trim().min(1, "Title cannot be empty").optional(),

    content: z.string().trim().min(1, "Content cannot be empty").optional(),

    tags: z.array(z.string().trim().min(1)).optional(),
  })
  .refine(
    (data) =>
      data.title !== undefined ||
      data.content !== undefined ||
      data.tags !== undefined,
    {
      message: "At least one field must be provided for update",
    }
  );