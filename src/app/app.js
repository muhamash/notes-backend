import cookieParser from 'cookie-parser';
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { globalNotFoundResponse } from "./middleware/globalNotFound.middleware.js";
import { rateLimitMiddleware } from './middleware/rateLimitingSliding.middleware.js';
import { homeRouter } from './modules/home/home.route.js';
import { servicesRouter } from "./routes/service.route.js";

const app = express();

// rate limiting 5 req per min
app.use(rateLimitMiddleware);

app.use( cookieParser() );
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use( cors( {
  origin: "*",
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));


// test home route
app.use(homeRouter)

// service route
app.use( "/api/v1", servicesRouter );

// global not-found route
app.use( globalNotFoundResponse )

// global error route
app.use(globalNotFoundResponse)


export default app;