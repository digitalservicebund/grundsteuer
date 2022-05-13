import compression from "compression";
import dotenv from "dotenv-safe";
import express, { Request } from "express";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import { jobs } from "~/cron.server";
import path from "path";
import invariant from "tiny-invariant";

const BUILD_DIR = path.join(process.cwd(), "build");

const appMode = process.env.APP_MODE;

// cron mode is intended for running cron jobs only. The app will not serve any HTTP requests in this mode.
if (appMode === "cron") {
  invariant(process.env.DATABASE_URL, "DATABASE_URL is not set.");
  // run every hour
  jobs.scheduleFscCleanup("0 * * * *");
} else {
  // Fail fast on missing configuration parameters
  dotenv.config();

  const app = express();

  app.use(compression());

  // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
  app.disable("x-powered-by");

  // Remix fingerprints its assets so we can cache forever.
  app.use(
    "/build",
    express.static("public/build", { immutable: true, maxAge: "1y" })
  );

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static("public", { maxAge: "1h" }));

  app.use(morgan("tiny"));

  const getLoadContext = (req: Request) => ({
    clientIp: req.headers["x-real-ip"] || req.socket?.remoteAddress,
  });

  app.all(
    "*",
    process.env.NODE_ENV === "development"
      ? (req, res, next) => {
          purgeRequireCache();

          return createRequestHandler({
            build: require(BUILD_DIR),
            getLoadContext,
            mode: process.env.NODE_ENV,
          })(req, res, next);
        }
      : createRequestHandler({
          build: require(BUILD_DIR),
          getLoadContext,
          mode: process.env.NODE_ENV,
        })
  );
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });
}

function purgeRequireCache() {
  // purge require cache on requests for "server side HMR" this won't let
  // you have in-memory objects between requests in development,
  // alternatively you can set up nodemon/pm2-dev to restart the server on
  // file changes, but then you'll have to reconnect to databases/etc on each
  // change. We prefer the DX of this, so we've included it for you by default
  for (const key in require.cache) {
    if (key.startsWith(BUILD_DIR)) {
      delete require.cache[key];
    }
  }
}
