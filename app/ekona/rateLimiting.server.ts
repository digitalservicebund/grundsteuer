import Redis from "ioredis";

export const redis = new Redis();

const incrementCurrentLimit = async () => {
  const currentSecond = new Date().getSeconds().toString();
  await redis.multi().incr(currentSecond).expire(currentSecond, 59).exec();
};

export const applyRateLimit = async () => {
  const currRate = await redis.get(new Date().getSeconds().toString());
  if (!currRate || Number.parseInt(currRate) < 5) {
    await incrementCurrentLimit();
    return true;
  }
  return false;
};
