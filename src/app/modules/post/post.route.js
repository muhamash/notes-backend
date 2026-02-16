import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth.middleware.js";
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import { createPost, deletePost, getAllPosts, getSinglePost, getUserPosts, updatePost } from "./post.controller.js";
import { createPostSchema, updatePostSchema } from "./post.validation.js";



const router = Router();

// connected to the frontend
router.post("/create", checkAuth, validateRequest(createPostSchema), createPost)

// connected to the frontend
router.get( "/get-user-post", checkAuth, getUserPosts );

// extra
router.get( "/get-user-single-post/:postId", checkAuth, getSinglePost );

// extra
router.patch( "/update-user-post/:postId", checkAuth, validateRequest( updatePostSchema ), updatePost );

// extra
router.delete("/delete-user-post/:postId", checkAuth, deletePost)


// public--> connected to the frontend
router.get( "/get-all-post", getAllPosts );

export const postRoute = router;