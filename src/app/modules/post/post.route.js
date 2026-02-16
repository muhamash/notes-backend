import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth.middleware.js";
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import { createPost, deletePost, getAllPosts, getSinglePost, getUserPosts, updatePost } from "./post.controller.js";
import { createPostSchema, updatePostSchema } from "./post.validation.js";



const router = Router();


router.post("/create", checkAuth, validateRequest(createPostSchema), createPost)

router.get( "/get-user-post/:userId", checkAuth, getUserPosts );

// extra
router.get( "/get-user-single-post/:userId/:postId", checkAuth, getSinglePost );

router.put( "/update-user-post/:userId/:postId", checkAuth, validateRequest( updatePostSchema ), updatePost );

router.delete("/delete-user-post/:userId/:postId", checkAuth, deletePost)


// public
router.get( "/get-all-post", getAllPosts );

export const postRoute = router;