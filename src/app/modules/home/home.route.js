import { Router } from "express";
import { homeRoute } from "./home.service.js";


export const homeRouter = Router();


homeRouter.get( "/", homeRoute );