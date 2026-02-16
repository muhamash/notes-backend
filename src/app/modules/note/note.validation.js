import mongoose from "mongoose";
import { z } from "zod";


const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid user ID",
  });


const titleSchema = z
  .string()
  .trim()
  .min(1, "Title is required")
  .max(200, "Title cannot exceed 200 characters");

const contentSchema = z
  .string()
  .trim()
  .min(1, "Content is required");

const tagsSchema = z
  .array(z.string().trim().min(1, "Tag cannot be empty"))
  .max(10, "Maximum 10 tags allowed")
  .optional();


export const createNoteSchema = z.object({
  userId: objectIdSchema,
  title: titleSchema,
  content: contentSchema,
  tags: tagsSchema,
});


export const updateNoteSchema = z
  .object({
    userId: objectIdSchema.optional(),
    title: titleSchema.optional(),
    content: contentSchema.optional(),
    tags: tagsSchema,
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    {
      message: "At least one field must be provided for update",
    }
  );