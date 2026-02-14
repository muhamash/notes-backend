import { Router } from "express";
import { homeRoute } from "../modules/home/home.service.js";


export const servicesRouter = Router()


const serviceRoute = [
    {
        path: "/",
        route: homeRoute
    }
]

serviceRoute.forEach( router =>
{
    servicesRouter.use( router.path, router.route )
} );