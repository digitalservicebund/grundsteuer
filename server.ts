import compression from "compression";
import dotenv from "dotenv-safe";
import express, { Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { createRequestHandler } from "@remix-run/express";
import { jobs } from "~/cron.server";
import path from "path";
import invariant from "tiny-invariant";
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";
import { registerSentry, sentryLoadContext } from "~/sentry-remix-node";
import { db } from "~/db.server";

const BUILD_DIR = path.join(process.cwd(), "build");

const appMode = process.env.APP_MODE;

function loadBuild() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  let build = require(BUILD_DIR);
  build = registerSentry(build);
  return build;
}

// cron mode is intended for running cron jobs only. The app will not serve any HTTP requests in this mode.
if (appMode === "cron") {
  invariant(process.env.DATABASE_URL, "DATABASE_URL is not set.");
  // run once every hour
  jobs.scheduleFscCleanup("0 * * * *");
  jobs.schedulePdfCleanup("30 * * * *");
} else {
  // Fail fast on missing configuration parameters
  dotenv.config();

  const app = express();

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.APP_ENV,
    tracesSampleRate: 1.0,
    integrations: [new Tracing.Integrations.Prisma({ client: db })],
  });

  // Set security-related http headers
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          // unfortunately we have to allow unsafe inline scripts, as otherwise Remix does not work;
          // issue is tracked here: https://github.com/remix-run/remix/issues/183
          scriptSrc: [
            "'self'",
            "plausible.io",
            "*.sentry.io",
            "'unsafe-inline'",
          ],
          // allow connections from WebSocket for development tooling
          connectSrc:
            process.env.APP_ENV === "local"
              ? ["*"]
              : ["'self'", "plausible.io", "*.sentry.io"],
        },
      },
      referrerPolicy: {
        // keep referrer for "internal" traffic to facilitate plausible tracking
        policy: "same-origin",
      },
    })
  );
  app.use((_req, res, next) => {
    res.setHeader("Permissions-Policy", "clipboard-write=(self)");
    next();
  });

  app.use(compression());

  // Remix fingerprints its assets so we can cache forever.
  app.use(
    "/build",
    express.static("public/build", { immutable: true, maxAge: "1y" })
  );

  // Everything else (like favicon.ico) is cached for an hour. You may want to be
  // more aggressive with this caching.
  app.use(express.static("public", { maxAge: "1h" }));

  app.use(morgan("tiny"));

  app.use(Sentry.Handlers.errorHandler());

  app.set("trust proxy", true);

  const getLoadContext = (req: Request, res: Response) => ({
    clientIp: req.ip,
    ...sentryLoadContext(req, res),
  });

  app.all(
    "*",
    process.env.NODE_ENV === "development"
      ? (req, res, next) => {
          purgeRequireCache();

          return createRequestHandler({
            build: loadBuild(),
            getLoadContext,
            mode: process.env.NODE_ENV,
          })(req, res, next);
        }
      : createRequestHandler({
          build: loadBuild(),
          getLoadContext,
          mode: process.env.NODE_ENV,
        })
  );
  const port = process.env.PORT || 3000;

  const server = app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received: closing HTTP server gracefully`);
    server.close(() => {
      console.log("HTTP server closed");
    });
  };

  const SIGINT = "SIGINT";
  const SIGTERM = "SIGTERM";
  process.on(SIGINT, () => shutdown(SIGINT));
  process.on(SIGTERM, () => shutdown(SIGTERM));
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
