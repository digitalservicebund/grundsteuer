require("@testing-library/jest-dom");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Redis = require("ioredis");

if (!global.ioredis) {
  global.ioredis = new Redis(process.env.REDIS_URL);
  console.log("Redis connection opened");
}

// eslint-disable-next-line no-undef
afterAll(async () => {
  if (global.ioredis) {
    await global.ioredis.quit();
    global.ioredis = undefined;
    console.log("Redis connection closed");
  }
});
