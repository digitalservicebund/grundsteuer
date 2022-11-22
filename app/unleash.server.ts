import { Unleash, UnleashConfig } from "unleash-client";
import env from "~/env";

let unleash: Unleash;

const unleashConfig: UnleashConfig = {
  url: `${env.UNLEASH_HOST}/api/`,
  appName: "grundsteuer",
  environment: env.APP_ENV === "production" ? "production" : "development",
  customHeaders: {
    Authorization: env.UNLEASH_API_TOKEN,
  },
  disableMetrics: true,
  refreshInterval: env.UNLEASH_REFRESH_INTERVAL,
};

declare global {
  // eslint-disable-next-line
  var __unleash: Unleash | undefined;
}

if (env.NODE_ENV === "production") {
  unleash = new Unleash(unleashConfig);
} else {
  if (!global.__unleash) {
    global.__unleash = new Unleash(unleashConfig);
  }
  unleash = global.__unleash;
}

unleash.on("ready", console.log.bind(console, "Unleash is ready"));

// required error handling when using unleash directly
unleash.on("error", console.error);

export { unleash };
