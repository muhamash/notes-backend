import httpStatus from "http-status-codes";
import { asyncHandler, responseFunction } from "../../utils/controller.util.js";
import { createPostService, deletePostService, getAllPostsService, getSinglePostService, getUserPostsService, updatePostService } from "./post.service.js";


export const createPost = asyncHandler( async ( req, res ) =>
{
    const { userId, payload } = req?.body;

    const post = await createPostService( userId, payload );

    return responseFunction( res, {
        message: "Post is created",
        statusCode: httpStatus.OK,
        data: post
    })
} )


export const getUserPosts = asyncHandler( async ( req, res ) =>
{
    const { userId } = req.params;
    const query = req.query;

    const posts = await getUserPostsService( userId, query );

    return responseFunction( res, {
        message: "User posts fetched successfully",
        statusCode: httpStatus.OK,
        data: posts,
    } );
} );


export const getSinglePost = asyncHandler( async ( req, res ) =>
{
    const { userId, postId } = req.params;

    const post = await getSinglePostService( userId, postId );

    return responseFunction( res, {
        message: "Post fetched successfully",
        statusCode: httpStatus.OK,
        data: post,
    } );
} );

// admin + public
export const getAllPosts = asyncHandler( async ( req, res ) =>
{
    const query = req.query;

    const posts = await getAllPostsService( query );

    return responseFunction( res, {
        message: "All posts fetched successfully",
        statusCode: httpStatus.OK,
        data: posts,
    } );
} );

export const updatePost = asyncHandler( async ( req, res ) =>
{
    const { userId, postId } = req.params;
    const payload = req.body;

    const updatedPost = await updatePostService( userId, postId, payload );

    return responseFunction( res, {
        message: "Post updated successfully",
        statusCode: httpStatus.OK,
        data: updatedPost,
    } );
} );

export const deletePost = asyncHandler( async ( req, res ) =>
{
    const { userId, postId } = req.params;

    const deletedPost = await deletePostService( userId, postId );

    return responseFunction( res, {
        message: "Post deleted successfully",
        statusCode: httpStatus.OK,
        data: deletedPost,
    } );
} );