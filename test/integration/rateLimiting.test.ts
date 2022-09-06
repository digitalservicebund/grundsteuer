import { checkRateLimit, redis } from "~/ekona/rateLimiting.server";

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
    await redis.del(mockedCurrentSeconds);
  });

  afterAll(async () => {
    await redis.del(mockedCurrentSeconds);
    redis.quit();
    jest.resetAllMocks();
  });
  describe("when called once per second", () => {
    it("should return true", async () => {
      expect(await checkRateLimit()).toBe(true);
    });

    it("should set expiry", async () => {
      await checkRateLimit();
      expect(await redis.expiretime(mockedCurrentSeconds)).toBeGreaterThan(0);
    });
  });

  describe("when already called four times per second", () => {
    beforeEach(async () => {
      await checkRateLimit();
      await checkRateLimit();
      await checkRateLimit();
      await checkRateLimit();
    });

    it("should return true if called once", async () => {
      expect(await checkRateLimit()).toBe(true);
    });

    it("should return false if called twice", async () => {
      await checkRateLimit();
      expect(await checkRateLimit()).toBe(false);
    });
  });
});
