import { Router } from "express";
import { userRoute } from "../modules/user/user.route.js";


export const servicesRouter = Router()


const serviceRoute = [
    // {
    //     path: "/",
    //     route: homeRoute
    // },
    {
        path: "/user",
        route: userRoute
    }
]

serviceRoute.forEach( router =>
{
    servicesRouter.use( router.path, router.route )
} );