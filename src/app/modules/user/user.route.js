import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import { getGroupByUsersInterests, login, registerUser } from "./user.controller.js";
import { loginUserSchema, registerUserSchema } from "./user.validation.js";



const router = Router();

// connected to the frontend
router.post( "/register", validateRequest( registerUserSchema ), registerUser );


// connected to the frontend
router.post( "/login", validateRequest( loginUserSchema ), login );


// connected to the frontend
router.get( "/get-users-interests", getGroupByUsersInterests );


export const userRoute = router;