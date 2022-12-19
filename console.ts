import repl from "node:repl";
import _ from "lodash";
import * as cron from "./app/cron.server";
import { db } from "./app/db.server";
import * as user from "./app/domain/user";
import { getClient, redis } from "./app/redis/redis.server";
import * as services from "./app/services";
import * as mails from "./app/mails";

const { APP_ENV, APP_VERSION } = process.env;

if (APP_ENV === "production") {
  console.warn(`
  ===================================
  ===  You are on PRODUCTION !!!  ===
  ===  You are on PRODUCTION !!!  ===
  ===  You are on PRODUCTION !!!  ===
  ===================================
`);
}

console.log(`
  Grundsteuer Console

  APP_ENV:     ${APP_ENV}
  APP_VERSION: ${APP_VERSION}

  Type .exit     to exit this console.
  Type .examples to show a few usage examples.
  Type .help     for more help.
`);

const replServer = repl.start({ prompt: `${APP_ENV}> ` });

const initializeContext = (context: any) => {
  context.env = process.env;
  context.lodash = _;
  context.db = db;
  context.user = user;
  context.redis = redis;
  context.cron = cron;
  context.getRedisClient = getClient;
  context.services = services;
  context.mails = mails;
};

initializeContext(replServer.context);

// eslint-disable-next-line @typescript-eslint/no-empty-function
replServer.setupHistory(".console_history", () => {});

replServer.on("reset", initializeContext);
replServer.on("exit", () => {
  process.exit();
});

replServer.defineCommand("examples", {
  help: "Show usage examples",
  action() {
    this.clearBufferedCommand();
    console.log(`
  Some examples to get you started:

  > env
  > lodash.times(10)
  > await user.findUserByEmail("foo@bar.com")
  > await user.deleteUserByEmail("foo@bar.com")
  > await getRedisClient().keys("*")

  Please read <PROJECT_ROOT>/console.ts to
  understand what you can do in the console.
`);
    this.displayPrompt();
  },
});
