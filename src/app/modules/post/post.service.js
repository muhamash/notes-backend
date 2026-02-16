import httpStatus from "http-status-codes";
import mongoose from "mongoose";
import { AppError } from "../../../config/errors/error.config.js";
import { parsedDataFn } from "../../utils/controller.util.js";
import { isValidObjectId } from "../../utils/service.util.js";
import { User } from "../user/user.model.js";
import { Post } from "./post.model.js";


export const createPostService = async ( userId, title, content ) =>
{
    if ( !isValidObjectId( userId ) )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "Invalid user ID" );
    }

    if ( !title?.trim() || !content?.trim() )
    {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Title and content are required"
        );
    }

    const post = await Post.create( {
        user: userId,
        title: title.trim(),
        content: content.trim(),
        // tags: tags || [],
    } );

    if ( !post )
    {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Unable to create post"
        );
    }

    return parsedDataFn(post);
};


export const getUserPostsService = async ( userId, query ) =>
{
    if ( !isValidObjectId( userId ) )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "Invalid user ID" );
    }

    
    let page = Number( query.page ) || 1;
    let limit = Number( query.limit ) || 10;

    if ( page < 1 ) page = 1;
    if ( limit < 1 ) limit = 10;
    if ( limit > 100 ) limit = 100;

    const skip = ( page - 1 ) * limit;

    const result = await User.aggregate( [
        {
            $match: { _id: new mongoose.Types.ObjectId( userId ) },
        },
        {
            $lookup: {
                from: "posts",
                let: { userId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: [ "$user", "$$userId" ] } } },
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    { $project: { __v: 0 } },
                ],
                as: "posts",
            },
        },
        {
            $project: {
                password: 0,
                __v: 0,
            },
        },
    ] );

    if ( !result || result.length === 0 )
    {
        throw new AppError( httpStatus.NOT_FOUND, "User not found" );
    }

    
    const totalPosts = await Post.countDocuments( { user: userId } );

    return {
        ...result[ 0 ],
        meta: {
            total: totalPosts,
            page,
            limit,
            totalPages: Math.ceil( totalPosts / limit ),
            hasNextPage: page * limit < totalPosts,
            hasPrevPage: page > 1,
        },
    };
};


export const getSinglePostService = async ( userId, postId ) =>
{
    if ( !isValidObjectId( userId ) || !isValidObjectId( postId ) )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "Invalid ID" );
    }

    const post = await Post.findOne( {
        _id: postId,
        user: userId,
    } ).lean();

    if ( !post )
    {
        throw new AppError( httpStatus.NOT_FOUND, "Post not found" );
    }

    return post;
};


export const updatePostService = async ( userId, postId, payload ) =>
{
    if ( !isValidObjectId( userId ) || !isValidObjectId( postId ) )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "Invalid ID" );
    }

    if ( !payload || Object.keys( payload ).length === 0 )
    {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Update payload cannot be empty"
        );
    }

    const existingPost = await Post.findOne( {
        _id: postId,
        user: userId,
    } ).lean();

    if ( !existingPost )
    {
        throw new AppError( httpStatus.NOT_FOUND, "Post not found" );
    }

    const updateData = {};

    if ( payload.title ) updateData.title = payload.title.trim();
    if ( payload.content ) updateData.content = payload.content.trim();
    if ( payload.tags ) updateData.tags = payload.tags;

    const updatedPost = await Post.findOneAndUpdate(
        { _id: postId, user: userId },
        updateData,
        { new: true }
    ).lean();

    if ( !updatedPost )
    {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Error while updating post"
        );
    }

    return updatedPost;
};


export const deletePostService = async ( userId, postId ) =>
{
    if ( !isValidObjectId( userId ) || !isValidObjectId( postId ) )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "Invalid ID" );
    }

    const post = await Post.findOne( {
        _id: postId,
        user: userId,
    } ).lean();

    if ( !post )
    {
        throw new AppError( httpStatus.NOT_FOUND, "Post not found" );
    }

    const deletedPost = await Post.findOneAndDelete( {
        _id: postId,
        user: userId,
    } ).lean();

    if ( !deletedPost )
    {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Error while deleting post"
        );
    }

    return deletedPost;
};


// public 

export const getAllPostsService = async ( query ) =>
{
    let page = Number( query.page ) || 1;
    let limit = Number( query.limit ) || 10;

    if ( page < 1 ) page = 1;
    if ( limit < 1 ) limit = 10;
    if ( limit > 100 ) limit = 100;

    const skip = ( page - 1 ) * limit;

    const result = await Post.aggregate( [
        {
            $facet: {
                posts: [
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    {
                        $unwind: {
                            path: "$user",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $project: {
                            title: 1,
                            content: 1,
                            tags: 1,
                            createdAt: 1,
                            "user._id": 1,
                            "user.name": 1,
                            "user.email": 1,
                        },
                    },
                ],

               
                totalCount: [ { $count: "count" } ],
                
                users: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "user",
                            foreignField: "_id",
                            as: "user",
                        },
                    },
                    { $unwind: "$user" },
                    {
                        $group: {
                            _id: "$user._id",
                            name: { $first: "$user.name" },
                            email: { $first: "$user.email" },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            email: 1,
                        },
                    },
                ],
            },
        },
    ] );

    const posts = result[ 0 ].posts;
    const total = result[ 0 ].totalCount[ 0 ]?.count || 0;
    const users = result[ 0 ].users;

    return {
        data: posts,
        users,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil( total / limit ),
            hasNextPage: page * limit < total,
            hasPrevPage: page > 1,
        },
    };
};