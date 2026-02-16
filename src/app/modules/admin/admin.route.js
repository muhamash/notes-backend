import { Router } from "express";
import { checkAuth } from "../../middleware/checkAuth.middleware.js";
import { requireAdmin } from "../../middleware/requireAdmin.middleware.js";
import
    {
        blockUser,
        deleteUser,
        getAllUsers,
        getUserById,
        updateUser,
    } from "./admin.controller.js";


const router = Router();


router.get( "/", checkAuth, requireAdmin, getAllUsers );


router.get("/:userId", checkAuth, requireAdmin, getUserById);


router.patch( "/:userId", checkAuth,requireAdmin, updateUser );


router.delete( "/:userId", checkAuth,requireAdmin, deleteUser );


router.patch("/:userId/block", checkAuth,requireAdmin, blockUser);


export const adminRoute = router;