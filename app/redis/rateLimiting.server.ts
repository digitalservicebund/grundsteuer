import { Feature, redis } from "~/redis/redis.server";
import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";

const incrementCurrentLimit = async (feature: Feature) => {
  const currentSecond = new Date().getSeconds().toString();
  await redis.incr(feature, currentSecond, 59);
};

export const applyRateLimit = async (feature: Feature, limit = 5) => {
  const currRate = await redis.get(feature, new Date().getSeconds().toString());
  if (!currRate || Number.parseInt(currRate) < limit) {
    await incrementCurrentLimit(feature);
    return true;
  }
  return false;
};

const getHashedIpKey = async (ip: string) => {
  invariant(
    process.env.HASHED_IP_LIMIT_SALT,
    "Environment variable HASHED_IP_LIMIT_SALT is not defined"
  );
  const currentSecond = new Date().getSeconds().toString();
  return (
    (await bcrypt.hash(ip, process.env.HASHED_IP_LIMIT_SALT)) + currentSecond
  );
};

const incrementCurrentIpLimit = async (feature: Feature, ip: string) => {
  await redis.incr(feature, await getHashedIpKey(ip), 59);
};

export const applyIpRateLimit = async (
  feature: Feature,
  ip: string,
  limit = 10
) => {
  const currRate = await redis.get(feature, await getHashedIpKey(ip));
  if (!currRate || Number.parseInt(currRate) < limit) {
    await incrementCurrentIpLimit(feature, ip);
    return true;
  }
  return false;
};
