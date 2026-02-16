import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth.middleware.js";
import { requireAdmin } from "../../middleware/requireAdmin.middleware.js";
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import
    {
        createNote,
        deleteNote,
        getAllNotes,
        getSingleNote,
        getUserNotes,
        updateNote,
    } from "./note.controller.js";
import { createNoteSchema, updateNoteSchema } from "./note.validation.js";


const router = Router();

//connected to frontend
router.post("/create-note",checkAuth, validateRequest(createNoteSchema), createNote);

// admin only
router.get( "/get-all-note", checkAuth, requireAdmin, getAllNotes );

// connected to frontend
router.get( "/get-user-note/:userId", checkAuth, getUserNotes );


// connected to frontend
router.get("/get-single-user-note/:noteId",checkAuth, getSingleNote);


// connected to frontend
router.patch("/update-note/:noteId",checkAuth, validateRequest(updateNoteSchema), updateNote);


// connected to frontend
router.delete("/delete-note/:noteId",checkAuth, deleteNote);

export const noteRoute = router;