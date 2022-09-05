import Redis from "ioredis";

const redis = new Redis();

const addUserToCurrentLimit = async () => {
  const currentSecond = new Date().getSeconds().toString();
  await redis.multi().incr(currentSecond).expire(currentSecond, 59).exec();
};

export const checkRateLimit = async () => {
  const currRate = await redis.get(new Date().getSeconds().toString());
  if (!currRate || Number.parseInt(currRate) < 5) {
    await addUserToCurrentLimit();
    return true;
  }
  return false;
};
