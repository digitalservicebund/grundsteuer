/* eslint-disable @typescript-eslint/no-var-requires */
const express = require("express");
const compression = require("compression");
const morgan = require("morgan");
const { createRequestHandler } = require("@remix-run/express");
const path = require("path");
const helmet = require("helmet");
const dotenv = require("dotenv-safe");
const { createHttpTerminator } = require("http-terminator");
const Redis = require("ioredis");
/* eslint-enable @typescript-eslint/no-var-requires */

const BUILD_DIR = path.join(process.cwd(), "build");

let isOnline = true;

// Fail fast on missing configuration parameters
dotenv.config();
const app = express();

// Set security-related http headers
app.use(
  helmet({
    //We have to disable this for embedding the useid widget
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        // unfortunately we have to allow unsafe inline scripts, as otherwise Remix does not work;
        // issue is tracked here: https://github.com/remix-run/remix/issues/183
        scriptSrc: [
          "'self'",
          "*.sentry.io",
          "'unsafe-inline'",
          process.env.USEID_DOMAIN,
        ],
        frameSrc: [process.env.USEID_DOMAIN],
        "form-action":
          process.env.USE_TEST_CSP === "true"
            ? "self localhost:3000 https://grund-stag.dev.ds4g.net e4k-portal.een.elster.de"
            : "self https://www.grundsteuererklaerung-fuer-privateigentum.de/ www.elster.de",

        // allow connections from WebSocket for development tooling
        connectSrc:
          process.env.NODE_ENV === "development"
            ? ["*"]
            : ["'self'", "plausible.io", "*.sentry.io"],
        upgradeInsecureRequests:
          process.env.NODE_ENV === "development" ? null : [],
      },
    },
    referrerPolicy: {
      // keep referrer for "internal" traffic to facilitate plausible tracking
      policy: "strict-origin-when-cross-origin",
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

app.use(
  morgan("tiny", {
    skip:
      process.env.LOG_SUCCESSFUL_REQUESTS === "true"
        ? false
        : function (req, res) {
            return res.statusCode < 400;
          },
  })
);

app.set("trust proxy", true);

const getLoadContext = (req) => ({
  clientIp: req.ip,
  online: isOnline,
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

const server = app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});

const httpTerminator = createHttpTerminator({
  server,
});

if (!global.ioredis) {
  global.ioredis = new Redis(process.env.REDIS_URL);
  console.log("Redis connection opened");
}

const shutdown = async (signal) => {
  if (server.listening) {
    console.log(`${signal} received: closing HTTP server gracefully`);
    isOnline = false;
    await httpTerminator.terminate();
    console.log("HTTP server closed");
    if (global.ioredis) {
      await global.ioredis.quit();
      global.ioredis = undefined;
      console.log("Redis connection closed");
    }
  }
};

const SIGINT = "SIGINT";
const SIGTERM = "SIGTERM";
process.on(SIGINT, async () => await shutdown(SIGINT));
process.on(SIGTERM, async () => await shutdown(SIGTERM));

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
