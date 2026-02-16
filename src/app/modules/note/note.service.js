import httpStatus from "http-status-codes";
import { AppError } from "../../../config/errors/error.config.js";
import { isValidObjectId } from "../../utils/service.util.js";
import { Note } from "./note.model.js";


export const createNoteService = async ( userId, payload ) =>
{
    if ( !isValidObjectId( userId ) )
    {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid user ID" );
    }

    if ( !payload?.title?.trim() || !payload?.content?.trim() )
    {
        throw new AppError( httpStatus.BAD_REQUEST, "Title and content are required" );
    }

    const note = await Note.create( {
        user: userId,
        title: payload.title.trim(),
        content: payload.content.trim(),
        tags: payload.tags || [],
    } );

    if ( !note )
    {
        throw new AppError( httpStatus.INTERNAL_SERVER_ERROR, "Unable to create a note!" );
    }

    return note;
};


export const getUserNotesService = async ( userId, query ) =>
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
                from: "notes",
                let: { userId: "$_id" },
                pipeline: [
                    { $match: { $expr: { $eq: [ "$user", "$$userId" ] } } },
                    { $sort: { createdAt: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    { $project: { __v: 0 } },
                ],
                as: "notes",
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

    const totalNotes = await Note.countDocuments( { user: userId } );

    return {
        ...result[ 0 ],
        notesMeta: {
            total: totalNotes,
            page,
            limit,
            totalPages: Math.ceil( totalNotes / limit ),
            hasNextPage: page * limit < totalNotes,
            hasPrevPage: page > 1,
        },
    };
};


export const getAllNotesService = async ( query ) =>
{
    let page = Number( query.page ) || 1;
    let limit = Number( query.limit ) || 10;

    if ( page < 1 ) page = 1;
    if ( limit < 1 ) limit = 10;
    if ( limit > 100 ) limit = 100;

    const skip = ( page - 1 ) * limit;

    const total = await Note.countDocuments( {} );

    if ( total === 0 )
    {
        return {
            data: [],
            meta: {
                total: 0,
                page,
                limit,
                totalPages: 0,
                hasNextPage: false,
                hasPrevPage: false,
            },
        };
    }

  
    const notes = await Note.find( {} )
        .sort( { createdAt: -1 } ) 
        .skip( skip )
        .limit( limit )
        .populate( {
            path: "user",
            select: "name email", 
        } )
        .lean();

    return {
        data: notes,
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


export const getSingleNoteService = async ( userId, noteId ) =>
{
    if ( !isValidObjectId( userId ) || !isValidObjectId( noteId ) )
    {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid ID" );
    }

    const note = await Note.findOne( {
        _id: noteId,
        user: userId,
    } ).lean();

    if ( !note )
    {
        throw new AppError(httpStatus.NOT_FOUND, "Note not found" );
    }

    return note;
};


export const updateNoteService = async ( userId, noteId, payload ) =>
{
    if ( !isValidObjectId( userId ) || !isValidObjectId( noteId ) )
    {
        throw new AppError(httpStatus.BAD_REQUEST, "Id is not valid")
    }

    if ( !payload || Object.keys( payload ).length === 0 )
    {
        throw new AppError(httpStatus.BAD_REQUEST, "Update payload cannot be empty" );
    }

    const note = await Note.findOne( {
        _id: noteId,
        user: userId,
    } ).lean();

    if ( !note )
    {
        throw new AppError(httpStatus.NOT_FOUND, "Note not found" );
    }

    const updateData = {};

    if ( payload.title ) updateData.title = payload.title.trim();
    if ( payload.content ) updateData.content = payload.content.trim();
    if ( payload.tags ) updateData.tags = payload.tags;

    const updatedNote = await Note.findOneAndUpdate(
        { _id: noteId, user: userId },
        updateData,
        { new: true }
    ).lean();

    if ( !updatedNote )
    {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Error while updating note" );
    }

    return updatedNote;
};


export const deleteNoteService = async ( userId, noteId ) =>
{
    if ( !isValidObjectId( userId ) || !isValidObjectId( noteId ) )
    {
        throw new Error( "Invalid ID" );
    }

    const note = await Note.findOne( {
        _id: noteId,
        user: userId,
    } ).lean();

    if ( !note )
    {
        throw new AppError(httpStatus.NOT_FOUND, "Note not found" );
    }

    const deletedNote = await Note.findOneAndDelete( {
        _id: noteId,
        user: userId,
    } ).lean();

    if ( !note )
    {
        throw new AppError(404, "Note not found")
    }

    return deletedNote;
};