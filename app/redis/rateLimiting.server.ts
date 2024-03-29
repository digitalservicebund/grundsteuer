import { Feature, redis } from "~/redis/redis.server";
import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";
import { flags } from "~/flags.server";

const incrementCurrentLimit = async (feature: Feature) => {
  const currentSecond = new Date().getSeconds().toString();
  await redis.incr(feature, currentSecond, 59);
};

export const applyRateLimit = async (feature: Feature, limit = 5) => {
  if (process.env.SKIP_RATELIMIT == "true") {
    return true;
  }
  const currRate = await redis.get(feature, new Date().getSeconds().toString());
  if (!currRate || Number.parseInt(currRate) < limit) {
    await incrementCurrentLimit(feature);
    return true;
  }
  return false;
};

const generateIpRateLimitKey = async (route: string, ip: string) => {
  invariant(
    process.env.HASHED_IP_LIMIT_SALT,
    "Environment variable HASHED_IP_LIMIT_SALT is not defined"
  );
  const currentMinute = new Date().getMinutes().toString();
  return (
    route +
    (await bcrypt.hash(ip, process.env.HASHED_IP_LIMIT_SALT)) +
    currentMinute
  );
};

const incrementCurrentIpLimit = async (hashedIpKey: string) => {
  await redis.incr(Feature.IP_RATE_LIMIT, hashedIpKey, 59);
};

const applyIpRateLimit = async (
  limitedRoute: string,
  ip: string,
  limit = 10
) => {
  if (process.env.SKIP_RATELIMIT == "true") {
    return true;
  }
  const hashedIpKey = await generateIpRateLimitKey(limitedRoute, ip);
  const currRate = await redis.get(Feature.IP_RATE_LIMIT, hashedIpKey);
  if (!currRate || Number.parseInt(currRate) < limit) {
    await incrementCurrentIpLimit(hashedIpKey);
    return true;
  }
  return false;
};

// You need to use this function in the route you want to rate limit
export const throwErrorIfRateLimitReached = async (
  ipAddress: string,
  limitedRoute: string,
  limit = 10
) => {
  if (!flags.isRatelimitingDisabled()) {
    if (!(await applyIpRateLimit(limitedRoute, ipAddress, limit))) {
      console.log("Rate limit exceeded at " + new Date().toISOString());
      throw new Response("Too many requests", { status: 429 });
    }
  }
};
