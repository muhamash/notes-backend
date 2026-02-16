import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth.middleware.js";
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
import { requireAdmin } from "../../middleware/requireAdmin.middleware.js";


const router = Router();


router.post("/create-note",checkAuth, validateRequest(createNoteSchema), createNote);

// admin only
router.get( "/get-all-note", checkAuth, requireAdmin, getAllNotes );


router.get( "/get-user-note/:userId", checkAuth, getUserNotes );

// extra
router.get("/get-single-user-note/:userId/:noteId",checkAuth, getSingleNote);


router.patch("/update-note/:userId/:noteId",checkAuth, validateRequest(updateNoteSchema), updateNote);


router.delete("/delete-note/:userId/:noteId",checkAuth, deleteNote);

export const noteRoute = router;