import httpStatus from "http-status-codes";
import { asyncHandler, responseFunction } from "../../utils/controller.util.js";
import
    {
        createNoteService,
        deleteNoteService,
        getAllNotesService,
        getSingleNoteService,
        getUserNotesService,
        updateNoteService,
    } from "./note.service.js";



export const createNote = asyncHandler( async ( req, res ) =>
{
    const { userId, content, title, tags } = req.body;
    // const { userId } = req?.params;
    console.log(userId, req?.user, content, title, tags)

    const note = await createNoteService( userId, content, title, tags );

    return responseFunction( res, {
        message: "Note created successfully",
        statusCode: httpStatus.CREATED,
        data: note,
    } );
} );


export const getUserNotes = asyncHandler( async ( req, res ) =>
{
    const { userId } = req.params;
    const query = req.query;

    const notes = await getUserNotesService( userId, query );

    return responseFunction( res, {
        message: "User notes fetched successfully",
        statusCode: httpStatus.OK,
        data: notes,
    } );
} );

// admin only
export const getAllNotes = asyncHandler( async ( req, res ) =>
{
    const query = req.query;

    const notes = await getAllNotesService( query );

    return responseFunction( res, {
        message: "All notes fetched successfully",
        statusCode: httpStatus.OK,
        data: notes,
    } );
} );


export const getSingleNote = asyncHandler( async ( req, res ) =>
{
    const { noteId } = req.params;
    const userId = req?.user?.id;

    const note = await getSingleNoteService( userId, noteId );

    return responseFunction( res, {
        message: "Note fetched successfully",
        statusCode: httpStatus.OK,
        data: note,
    } );
} );


export const updateNote = asyncHandler( async ( req, res ) =>
{
    const { noteId } = req.params;
    const payload = req.body;
    const userId = req?.user?.id;

    const updatedNote = await updateNoteService( userId, noteId, payload );

    return responseFunction( res, {
        message: "Note updated successfully",
        statusCode: httpStatus.OK,
        data: updatedNote,
    } );
} );


export const deleteNote = asyncHandler( async ( req, res ) =>
{
    const { noteId } = req.params;
    const userId = req?.user?.id;

    const deletedNote = await deleteNoteService( userId, noteId );

    return responseFunction( res, {
        message: "Note deleted successfully",
        statusCode: httpStatus.OK,
        data: deletedNote,
    } );
} );