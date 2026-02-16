import { Router } from "express";
import { validateRequest } from "../../middleware/validateRequest.middleware.js";
import { login, registerUser } from "./user.controller.js";
import { loginUserSchema, registerUserSchema } from "./user.validation.js";



const router = Router();


router.post( "/register", validateRequest( registerUserSchema ), registerUser );

router.post( "/login", validateRequest( loginUserSchema ), login );


export const userRoute = router;