import Redis from "ioredis";

export enum Feature {
  EMAIL = "message",
  RATE_LIMIT = "rate",
  CLIENT_IP = "clientIp",
}

let ioredis: Redis | undefined;

export function getClient() {
  if (!ioredis) {
    ioredis = new Redis(process.env.REDIS_URL as string);
  }
  return ioredis;
}

function appendKey(feature: Feature, key: string) {
  return `${feature}:${key}`;
}

const get = async (feature: Feature, key: string) => {
  return getClient().get(appendKey(feature, key));
};

const set = async (
  feature: Feature,
  key: string,
  value: string | number,
  ttlInSeconds = 600
) => {
  const appendedKey = appendKey(feature, key);
  await getClient()
    .multi()
    .set(appendedKey, value)
    .expire(appendedKey, ttlInSeconds)
    .exec();
};

const incr = async (feature: Feature, key: string, ttlInSeconds = 600) => {
  const appendedKey = appendKey(feature, key);
  await getClient()
    .multi()
    .incr(appendedKey)
    .expire(appendedKey, ttlInSeconds)
    .exec();
};

const del = async (feature: Feature, key: string) => {
  await getClient().del(appendKey(feature, key));
};

const flushAll = async () => {
  await getClient().flushall();
};

const ttl = async (feature: Feature, key: string) => {
  return getClient().ttl(appendKey(feature, key));
};

const quit = async () => {
  if (ioredis) {
    await getClient().quit();
    ioredis = undefined;
  }
};

export const redis = { set, get, incr, del, flushAll, ttl, quit };
