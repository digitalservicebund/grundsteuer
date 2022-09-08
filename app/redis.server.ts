import Redis from "ioredis";

const ioredis = new Redis();

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

const expiretime = async (key: string) => {
  return ioredis.expiretime(key);
};

const quit = async () => {
  await ioredis.quit();
};

export const redis = { set, get, incr, del, expiretime, quit };
