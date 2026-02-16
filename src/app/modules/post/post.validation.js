import mongoose from "mongoose";
import { z } from "zod";


const objectIdSchema = z
  .string()
  .refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid ObjectId",
  } );


export const createPostSchema = z.object( {
    userId: objectIdSchema,

    payload: z.object( {
        title: z
            .string( {
                required_error: "Title is required",
            } )
            .trim()
            .min( 1, "Title cannot be empty" ),

        content: z
            .string( {
                required_error: "Content is required",
            } )
            .trim()
            .min( 1, "Content cannot be empty" ),

        tags: z
            .array(
                z.string().trim().min( 1, "Tag cannot be empty" )
            )
            .optional()
            .default( [] ),
    } ),
} );


export const updatePostSchema = z.object( {
    userId: objectIdSchema,
    postId: objectIdSchema,

    payload: z
        .object( {
            title: z.string().trim().min( 1, "Title cannot be empty" ).optional(),
            content: z.string().trim().min( 1, "Content cannot be empty" ).optional(),
            tags: z.array( z.string().trim().min( 1 ) ).optional(),
        } )
        .refine(
            ( data ) => Object.keys( data ).length > 0,
            {
                message: "At least one field must be provided for update",
            }
        ),
} );