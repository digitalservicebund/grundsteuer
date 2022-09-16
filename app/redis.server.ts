import Redis from "ioredis";

let ioredis: Redis | undefined;

function getClient() {
  if (!ioredis) {
    ioredis = new Redis(process.env.REDIS_URL as string);
  }
  return ioredis;
}

const get = async (key: string) => {
  return getClient().get(key);
};

const set = async (key: string, value: string, ttlInSeconds = 600) => {
  await getClient().multi().set(key, value).expire(key, ttlInSeconds).exec();
};

const incr = async (key: string, ttlInSeconds = 600) => {
  await getClient().multi().incr(key).expire(key, ttlInSeconds).exec();
};

const del = async (key: string) => {
  await getClient().del(key);
};

const flushAll = async () => {
  await getClient().flushall();
};

const ttl = async (key: string) => {
  return getClient().ttl(key);
};

const quit = async () => {
  await getClient().quit();
  ioredis = undefined;
};

export const redis = { set, get, incr, del, flushAll, ttl, quit };
