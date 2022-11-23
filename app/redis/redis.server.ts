import Redis from "ioredis";

export enum Feature {
  MESSAGE_ID = "email",
  EMAIL = "message",
  RATE_LIMIT = "rate",
  BUNDES_IDENT_RATE_LIMIT = "bundesIdentRate",
  IP_RATE_LIMIT = "ipRate",
  CLIENT_IP = "clientIp",
}

declare global {
  // eslint-disable-next-line
  var ioredis: Redis | undefined;
}

export function getClient() {
  if (!global.ioredis) {
    global.ioredis = new Redis(process.env.REDIS_URL as string);
    console.log("Redis connection opened");
  }
  return global.ioredis;
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
  return await getClient()
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

export const redis = { set, get, incr, del, flushAll, ttl };
