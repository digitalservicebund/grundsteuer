import {
  applyIpRateLimit,
  applyRateLimit,
  throwErrorIfRateLimitReached,
} from "~/redis/rateLimiting.server";
import { Feature, redis } from "~/redis/redis.server";
import bcrypt from "bcryptjs";
import invariant from "tiny-invariant";

describe("ratelimiting", () => {
  const currentDate = Date.UTC(2022, 0, 1, 0, 0, 12);
  const mockedCurrentSeconds = new Date(currentDate).getSeconds().toString();
  beforeAll(() => {
    const mockDate = new Date(currentDate);
    const actualNowImplementation = Date.now;
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as string);
    Date.now = actualNowImplementation;
  });

  afterAll(async () => {
    jest.resetAllMocks();
  });

  describe("applyRatelimit", () => {
    beforeEach(async () => {
      await redis.del(Feature.RATE_LIMIT, mockedCurrentSeconds);
      await redis.del(Feature.BUNDES_IDENT_RATE_LIMIT, mockedCurrentSeconds);
    });

    afterAll(async () => {
      await redis.del(Feature.RATE_LIMIT, mockedCurrentSeconds);
      await redis.del(Feature.BUNDES_IDENT_RATE_LIMIT, mockedCurrentSeconds);
    });

    describe("when called once per second", () => {
      it("should return true", async () => {
        expect(await applyRateLimit(Feature.RATE_LIMIT)).toBe(true);
      });

      it("should set expiry", async () => {
        await applyRateLimit(Feature.RATE_LIMIT);
        const ttl = await redis.ttl(Feature.RATE_LIMIT, mockedCurrentSeconds);
        expect(ttl).toBeGreaterThan(0);
        expect(ttl).toBeLessThan(60);
      });
    });

    describe("when already called four times per second", () => {
      beforeEach(async () => {
        await applyRateLimit(Feature.RATE_LIMIT);
        await applyRateLimit(Feature.RATE_LIMIT);
        await applyRateLimit(Feature.RATE_LIMIT);
        await applyRateLimit(Feature.RATE_LIMIT);
      });

      it("should return true if called once", async () => {
        expect(await applyRateLimit(Feature.RATE_LIMIT)).toBe(true);
      });

      it("should return false if called twice", async () => {
        await applyRateLimit(Feature.RATE_LIMIT);
        expect(await applyRateLimit(Feature.RATE_LIMIT)).toBe(false);
      });
    });

    describe("when called with multiple features", () => {
      beforeEach(async () => {
        await applyRateLimit(Feature.RATE_LIMIT);
        await applyRateLimit(Feature.RATE_LIMIT);
        await applyRateLimit(Feature.BUNDES_IDENT_RATE_LIMIT);
        await applyRateLimit(Feature.BUNDES_IDENT_RATE_LIMIT);
      });

      it("should return true if called once with feature 1", async () => {
        expect(await applyRateLimit(Feature.RATE_LIMIT)).toBe(true);
      });

      it("should return true if called once with feature 2", async () => {
        expect(await applyRateLimit(Feature.BUNDES_IDENT_RATE_LIMIT)).toBe(
          true
        );
      });
    });

    describe("when already called four times with multiple features", () => {
      beforeEach(async () => {
        await applyRateLimit(Feature.BUNDES_IDENT_RATE_LIMIT);
        await applyRateLimit(Feature.BUNDES_IDENT_RATE_LIMIT);
        await applyRateLimit(Feature.RATE_LIMIT);
        await applyRateLimit(Feature.RATE_LIMIT);
        await applyRateLimit(Feature.BUNDES_IDENT_RATE_LIMIT);
        await applyRateLimit(Feature.BUNDES_IDENT_RATE_LIMIT);
      });

      it("should return true if called once again", async () => {
        expect(await applyRateLimit(Feature.BUNDES_IDENT_RATE_LIMIT)).toBe(
          true
        );
      });

      it("should return false if called twice", async () => {
        await applyRateLimit(Feature.BUNDES_IDENT_RATE_LIMIT);
        expect(await applyRateLimit(Feature.BUNDES_IDENT_RATE_LIMIT)).toBe(
          false
        );
      });
    });
  });

  describe("applyIpRatelimit", () => {
    let originalSkipRatelimitValue: string;
    const ipAddress = "123.012.234.122";
    const route1 = "this/is/the/way";
    const route2 = "this/is/not/the";

    let redisKey1: string;
    let redisKey2: string;

    beforeAll(async () => {
      if (process.env.SKIP_RATELIMIT) {
        originalSkipRatelimitValue = process.env.SKIP_RATELIMIT;
        process.env.SKIP_RATELIMIT = "false";
      }
      invariant(
        process.env.HASHED_IP_LIMIT_SALT,
        "Environment variable HASHED_IP_LIMIT_SALT is not defined"
      );
      redisKey1 =
        route1 +
        (await bcrypt.hash(ipAddress, process.env.HASHED_IP_LIMIT_SALT)) +
        mockedCurrentSeconds;
      redisKey2 =
        route2 +
        (await bcrypt.hash(ipAddress, process.env.HASHED_IP_LIMIT_SALT)) +
        mockedCurrentSeconds;
    });

    beforeEach(async () => {
      await redis.del(Feature.IP_RATE_LIMIT, redisKey1);
      await redis.del(Feature.IP_RATE_LIMIT, redisKey2);
    });

    afterAll(async () => {
      if (originalSkipRatelimitValue) {
        process.env.SKIP_RATELIMIT = "true";
      }
      await redis.del(Feature.IP_RATE_LIMIT, redisKey1);
      await redis.del(Feature.IP_RATE_LIMIT, redisKey2);
      jest.resetAllMocks();
    });

    describe("when called once per second", () => {
      it("should return true", async () => {
        expect(await applyIpRateLimit(route1, ipAddress)).toBe(true);
      });

      it("should set expiry", async () => {
        await applyIpRateLimit(route1, ipAddress);
        const ttl = await redis.ttl(Feature.IP_RATE_LIMIT, redisKey1);
        expect(ttl).toBeGreaterThan(0);
        expect(ttl).toBeLessThan(60);
      });
    });

    describe("when already called four times per second", () => {
      beforeEach(async () => {
        await applyIpRateLimit(route1, ipAddress, 5);
        await applyIpRateLimit(route1, ipAddress, 5);
        await applyIpRateLimit(route1, ipAddress, 5);
        await applyIpRateLimit(route1, ipAddress, 5);
      });

      it("should return true if called once", async () => {
        expect(await applyIpRateLimit(route1, ipAddress, 5)).toBe(true);
      });

      it("should return false if called twice", async () => {
        await applyIpRateLimit(route1, ipAddress);
        expect(await applyIpRateLimit(route1, ipAddress, 5)).toBe(false);
      });
    });

    describe("when called with multiple routes", () => {
      beforeEach(async () => {
        await applyIpRateLimit(route1, ipAddress, 5);
        await applyIpRateLimit(route1, ipAddress, 5);
        await applyIpRateLimit(route2, ipAddress, 5);
        await applyIpRateLimit(route2, ipAddress, 5);
      });

      it("should return true if called once with route 1", async () => {
        expect(await applyIpRateLimit(route1, ipAddress, 5)).toBe(true);
      });

      it("should return true if called once with route 2", async () => {
        expect(await applyIpRateLimit(route2, ipAddress, 5)).toBe(true);
      });
    });

    describe("when already called four times with multiple routes", () => {
      beforeEach(async () => {
        await applyIpRateLimit(route1, ipAddress, 5);
        await applyIpRateLimit(route1, ipAddress, 5);
        await applyIpRateLimit(route2, ipAddress, 5);
        await applyIpRateLimit(route2, ipAddress, 5);
        await applyIpRateLimit(route1, ipAddress, 5);
        await applyIpRateLimit(route1, ipAddress, 5);
      });

      it("should return true if called once again", async () => {
        expect(await applyIpRateLimit(route1, ipAddress, 5)).toBe(true);
      });

      it("should return false if called twice", async () => {
        await applyIpRateLimit(route1, ipAddress);
        expect(await applyIpRateLimit(route1, ipAddress, 5)).toBe(false);
      });
    });

    describe("throwErrorIfRateLimitReached", () => {
      const ipAddressSeenMultipleTimes = "098.765.432.123";
      const ipAddressSeenOnlyOnce = "123.456.789.012";
      const route1 = "this/is/the/way";
      const route2 = "this/is/not/the";

      afterAll(async () => {
        await redis.flushAll();
      });

      beforeEach(async () => {
        await redis.flushAll();
      });

      it("should throw no error if first occurrence of ip address", async () => {
        await throwErrorIfRateLimitReached(ipAddressSeenOnlyOnce, route1, 5);
      });

      it("should throw error if limit reached for ip address", async () => {
        await throwErrorIfRateLimitReached(ipAddressSeenOnlyOnce, route1, 5);
        await throwErrorIfRateLimitReached(ipAddressSeenOnlyOnce, route1, 5);
        await throwErrorIfRateLimitReached(ipAddressSeenOnlyOnce, route1, 5);
        await throwErrorIfRateLimitReached(ipAddressSeenOnlyOnce, route1, 5);
        await throwErrorIfRateLimitReached(ipAddressSeenOnlyOnce, route1, 5);
        await expect(
          throwErrorIfRateLimitReached(ipAddressSeenOnlyOnce, route1, 5)
        ).rejects.toMatchObject(
          new Response("Too many requests", { status: 429 })
        );
      });

      it("should throw no error if first occurence for route 2", async () => {
        await throwErrorIfRateLimitReached(
          ipAddressSeenMultipleTimes,
          route1,
          5
        );
        await throwErrorIfRateLimitReached(
          ipAddressSeenMultipleTimes,
          route1,
          5
        );
        await throwErrorIfRateLimitReached(
          ipAddressSeenMultipleTimes,
          route1,
          5
        );
        await throwErrorIfRateLimitReached(
          ipAddressSeenMultipleTimes,
          route1,
          5
        );

        await throwErrorIfRateLimitReached(
          ipAddressSeenMultipleTimes,
          route2,
          5
        );
      });
    });
  });
});
