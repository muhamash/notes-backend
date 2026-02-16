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

// connected to the frontend
router.get( "/all-users", checkAuth, requireAdmin, getAllUsers );

// extra
router.get("/:userId", checkAuth, requireAdmin, getUserById);

// extra
router.patch( "/:userId", checkAuth,requireAdmin, updateUser );

// connected to the frontend
router.delete( "/:userId", checkAuth,requireAdmin, deleteUser );

// connected to the frontend
router.patch("/:userId/block", checkAuth,requireAdmin, blockUser);


export const adminRoute = router;