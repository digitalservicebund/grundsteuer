import { Feature, redis } from "~/redis/redis.server";

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
