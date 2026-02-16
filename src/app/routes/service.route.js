import { Router } from "express";
import { postRoute } from "../modules/post/post.route.js";
import { userRoute } from "../modules/user/user.route.js";
import { noteRoute } from "../modules/note/note.route.js";
import { adminRoute } from "../modules/admin/admin.route.js";


export const servicesRouter = Router()


const serviceRoute = [
    // {
    //     path: "/",
    //     route: homeRoute
    // },
    {
        path: "/user",
        route: userRoute
    },
    {
        path: "/post",
        route: postRoute
    },
    {
        path: "/note",
        route: noteRoute
    },
    {
        path: "/admin",
        route: adminRoute
    }
]

serviceRoute.forEach( router =>
{
    servicesRouter.use( router.path, router.route )
} );