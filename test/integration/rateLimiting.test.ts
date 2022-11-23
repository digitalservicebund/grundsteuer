import {
  applyRateLimit,
  throwErrorIfRateLimitReached,
} from "~/redis/rateLimiting.server";
import { Feature, redis } from "~/redis/redis.server";

describe("ratelimiting", () => {
  const currentDate = Date.UTC(2022, 0, 1, 0, 0, 12);
  const mockedCurrentSeconds = new Date(currentDate).getSeconds().toString();
  const mockDateOneMinuteLater = new Date(Date.UTC(2022, 0, 1, 0, 1, 12));
  const mockDate = new Date(currentDate);
  let originalSkipRatelimitValue: string;

  beforeAll(() => {
    if (process.env.SKIP_RATELIMIT) {
      originalSkipRatelimitValue = process.env.SKIP_RATELIMIT;
      process.env.SKIP_RATELIMIT = "false";
    }
    const actualNowImplementation = Date.now;
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as string);
    Date.now = actualNowImplementation;
  });

  afterAll(async () => {
    if (originalSkipRatelimitValue) {
      process.env.SKIP_RATELIMIT = "true";
    }
    jest.restoreAllMocks();
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
      await throwErrorIfRateLimitReached(ipAddressSeenMultipleTimes, route1, 5);
      await throwErrorIfRateLimitReached(ipAddressSeenMultipleTimes, route1, 5);
      await throwErrorIfRateLimitReached(ipAddressSeenMultipleTimes, route1, 5);
      await throwErrorIfRateLimitReached(ipAddressSeenMultipleTimes, route1, 5);
      await throwErrorIfRateLimitReached(ipAddressSeenMultipleTimes, route1, 5);
      await expect(
        throwErrorIfRateLimitReached(ipAddressSeenMultipleTimes, route1, 5)
      ).rejects.toMatchObject(
        new Response("Too many requests", { status: 429 })
      );
    });

    it("should throw no error if first occurrence for route 2", async () => {
      await throwErrorIfRateLimitReached(ipAddressSeenMultipleTimes, route1, 5);
      await throwErrorIfRateLimitReached(ipAddressSeenMultipleTimes, route1, 5);
      await throwErrorIfRateLimitReached(ipAddressSeenMultipleTimes, route1, 5);
      await throwErrorIfRateLimitReached(ipAddressSeenMultipleTimes, route1, 5);
      await throwErrorIfRateLimitReached(ipAddressSeenMultipleTimes, route1, 5);

      await throwErrorIfRateLimitReached(ipAddressSeenMultipleTimes, route2, 5);
    });

    describe("with changed time between increases", () => {
      afterAll(() => {
        const actualNowImplementation = Date.now;
        jest
          .spyOn(global, "Date")
          .mockImplementation(() => mockDate as unknown as string);
        Date.now = actualNowImplementation;
      });

      it("should throw no error if first occurrence for this minute", async () => {
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
          route1,
          5
        );
        const actualNowImplementation = Date.now;
        jest
          .spyOn(global, "Date")
          .mockImplementation(
            () => mockDateOneMinuteLater as unknown as string
          );
        Date.now = actualNowImplementation;

        await throwErrorIfRateLimitReached(
          ipAddressSeenMultipleTimes,
          route1,
          5
        );
      });
    });
  });
});
