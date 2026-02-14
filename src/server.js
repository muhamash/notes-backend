import http from "http";
import app from "./app/app.js";
import { dbConnect } from "./config/db/mongoose.config.js";
import { envStrings } from "./config/env.config.js";

let server;

const startServer = async () =>
{
    try 
    {
        await dbConnect();

        server = http.createServer( app );

        server.listen( envStrings.PORT, () =>
        {
             console.log( `Server is listening at http://localhost:${ envStrings.PORT } ` );
        })

    }
    catch ( error )
    {
        console.error(error)
    }
}


async function gracefulShutdown ( signal )
{
  console.warn(` Received ${signal}, shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log(" HTTP server closed.");

      try {
        console.log("Server shutdown complete.");
      } catch (error) {
        console.error("Error during shutdown:", error);
      }

      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

function handleProcessEvents() {
  process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
  process.on("SIGINT", () => gracefulShutdown("SIGINT"));

  process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error);
    gracefulShutdown("uncaughtException");
  });

  process.on("unhandledRejection", (reason) => {
    console.error(" Unhandled Rejection:", reason);
    gracefulShutdown("unhandledRejection");
  });
}


startServer();