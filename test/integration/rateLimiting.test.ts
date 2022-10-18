import { applyRateLimit } from "~/ekona/rateLimiting.server";
import { Feature, redis } from "~/redis/redis.server";

describe("addUserToCurrentLimit", () => {
  const currentDate = Date.UTC(2022, 0, 1, 0, 0, 12);
  const mockedCurrentSeconds = new Date(currentDate).getSeconds().toString();

  beforeAll(() => {
    const mockDate = new Date(currentDate);
    jest
      .spyOn(global, "Date")
      .mockImplementation(() => mockDate as unknown as string);
  });

  beforeEach(async () => {
    await redis.del(Feature.RATE_LIMIT, mockedCurrentSeconds);
  });

  afterAll(async () => {
    await redis.del(Feature.RATE_LIMIT, mockedCurrentSeconds);
    jest.resetAllMocks();
  });
  describe("when called once per second", () => {
    it("should return true", async () => {
      expect(await applyRateLimit()).toBe(true);
    });

    it("should set expiry", async () => {
      await applyRateLimit();
      const ttl = await redis.ttl(Feature.RATE_LIMIT, mockedCurrentSeconds);
      expect(ttl).toBeGreaterThan(0);
      expect(ttl).toBeLessThan(60);
    });
  });

  describe("when already called four times per second", () => {
    beforeEach(async () => {
      await applyRateLimit();
      await applyRateLimit();
      await applyRateLimit();
      await applyRateLimit();
    });

    it("should return true if called once", async () => {
      expect(await applyRateLimit()).toBe(true);
    });

    it("should return false if called twice", async () => {
      await applyRateLimit();
      expect(await applyRateLimit()).toBe(false);
    });
  });
});
