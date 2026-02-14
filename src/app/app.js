import cookieParser from 'cookie-parser';
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { globalNotFoundResponse } from "./middleware/globalNotFound.middleware.js";
import { servicesRouter } from "./routes/service.route.js";

const app = express();


app.use( cookieParser() );
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use( cors( {
  origin: "*",
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));


// service route
app.use( "/", servicesRouter );

// global not-found route
app.use( globalNotFoundResponse )

// global error route
app.use(globalNotFoundResponse)


export default app;