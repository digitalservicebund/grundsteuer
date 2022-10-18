import { Feature, redis } from "~/redis/redis.server";

const incrementCurrentLimit = async () => {
  const currentSecond = new Date().getSeconds().toString();
  await redis.incr(Feature.RATE_LIMIT, currentSecond, 59);
};

export const applyRateLimit = async () => {
  const currRate = await redis.get(
    Feature.RATE_LIMIT,
    new Date().getSeconds().toString()
  );
  if (!currRate || Number.parseInt(currRate) < 5) {
    await incrementCurrentLimit();
    return true;
  }
  return false;
};
