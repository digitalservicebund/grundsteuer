import Redis from "ioredis";

const ioredis = new Redis(process.env.REDIS_URL as string);

const get = async (key: string) => {
  return ioredis.get(key);
};

const set = async (key: string, value: string, ttlInSeconds = 600) => {
  await ioredis.multi().set(key, value).expire(key, ttlInSeconds).exec();
};

const incr = async (key: string, ttlInSeconds = 600) => {
  await ioredis.multi().incr(key).expire(key, ttlInSeconds).exec();
};

const del = async (key: string) => {
  await ioredis.del(key);
};

const ttl = async (key: string) => {
  return ioredis.ttl(key);
};

const quit = async () => {
  await ioredis.quit();
};

export const redis = { set, get, incr, del, ttl, quit };
