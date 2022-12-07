require("@testing-library/jest-dom");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Redis = require("ioredis");

if (!global.ioredis) {
  global.ioredis = new Redis(process.env.REDIS_URL, {
    maxRetriesPerRequest: null,
  });
  console.log("Redis connection opened");
}

global.__unleash = {
  isEnabled: () => {
    return false;
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  on: () => {},
};

// eslint-disable-next-line no-undef
afterAll(async () => {
  if (global.__registeredQueues) {
    const names = Object.keys(global.__registeredQueues);
    for (const name of names) {
      const worker = global.__registeredQueues[name].worker;
      await worker.close();
      console.log(`Worker ${name} stopped`);
    }
  }
  if (global.ioredis) {
    await global.ioredis.quit();
    global.ioredis = undefined;
    console.log("Redis connection closed");
  }
});
