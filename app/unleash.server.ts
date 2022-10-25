import { Unleash, UnleashConfig } from "unleash-client";

let unleash: Unleash;

const unleashConfig: UnleashConfig = {
  url: process.env.UNLEASH_HOST + "/api/",
  appName: "grundsteuer",
  environment:
    process.env.APP_ENV === "production" ? "production" : "development",
  customHeaders: {
    Authorization: process.env.UNLEASH_API_TOKEN as string,
  },
  disableMetrics: true,
};

declare global {
  // eslint-disable-next-line
  var __unleash: Unleash | undefined;
}

if (process.env.NODE_ENV === "production") {
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
