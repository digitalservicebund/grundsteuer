import { applyRateLimit, applyIpRateLimit } from "~/redis/rateLimiting.server";
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
    const ipAddress = "123.012.234.122";
    let originalSkipRatelimitValue: string;

    let redisKey: string;

    beforeAll(async () => {
      if (process.env.SKIP_RATELIMIT) {
        originalSkipRatelimitValue = process.env.SKIP_RATELIMIT;
        process.env.SKIP_RATELIMIT = "false";
      }
      invariant(
        process.env.HASHED_IP_LIMIT_SALT,
        "Environment variable HASHED_IP_LIMIT_SALT is not defined"
      );
      redisKey =
        (await bcrypt.hash(ipAddress, process.env.HASHED_IP_LIMIT_SALT)) +
        mockedCurrentSeconds;
    });

    beforeEach(async () => {
      await redis.del(Feature.RATE_LIMIT, redisKey);
      await redis.del(Feature.IP_RATE_LIMIT, redisKey);
    });

    afterAll(async () => {
      if (originalSkipRatelimitValue) {
        process.env.SKIP_RATELIMIT = "true";
      }
      await redis.del(Feature.RATE_LIMIT, redisKey);
      await redis.del(Feature.IP_RATE_LIMIT, redisKey);
    });

    describe("when called once per second", () => {
      it("should return true", async () => {
        expect(await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress)).toBe(
          true
        );
      });

      it("should set expiry", async () => {
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress);
        const ttl = await redis.ttl(Feature.IP_RATE_LIMIT, redisKey);
        expect(ttl).toBeGreaterThan(0);
        expect(ttl).toBeLessThan(60);
      });
    });

    describe("when already called four times per second", () => {
      beforeEach(async () => {
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5);
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5);
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5);
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5);
      });

      it("should return true if called once", async () => {
        expect(
          await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5)
        ).toBe(true);
      });

      it("should return false if called twice", async () => {
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress);
        expect(
          await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5)
        ).toBe(false);
      });
    });

    describe("when called with multiple features", () => {
      beforeEach(async () => {
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5);
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5);
        await applyIpRateLimit(Feature.RATE_LIMIT, ipAddress, 5);
        await applyIpRateLimit(Feature.RATE_LIMIT, ipAddress, 5);
      });

      it("should return true if called once with feature 1", async () => {
        expect(
          await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5)
        ).toBe(true);
      });

      it("should return true if called once with feature 2", async () => {
        expect(await applyIpRateLimit(Feature.RATE_LIMIT, ipAddress, 5)).toBe(
          true
        );
      });
    });

    describe("when already called four times with multiple features", () => {
      beforeEach(async () => {
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5);
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5);
        await applyIpRateLimit(Feature.RATE_LIMIT, ipAddress, 5);
        await applyIpRateLimit(Feature.RATE_LIMIT, ipAddress, 5);
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5);
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5);
      });

      it("should return true if called once again", async () => {
        expect(
          await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5)
        ).toBe(true);
      });

      it("should return false if called twice", async () => {
        await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress);
        expect(
          await applyIpRateLimit(Feature.IP_RATE_LIMIT, ipAddress, 5)
        ).toBe(false);
      });
    });
  });
});
