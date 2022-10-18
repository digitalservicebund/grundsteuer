import { Feature, getClient, redis } from "~/redis/redis.server";

describe("redis wrapper", () => {
  const rawClient = getClient();

  afterEach(async () => {
    await redis.flushAll();
  });

  it("set should append key to feature prefix", async () => {
    await redis.set(Feature.EMAIL, "foo", "bar");

    const actualRecord = await rawClient.get("message:foo");

    expect(actualRecord).toEqual("bar");
  });

  it("get should append key to feature prefix", async () => {
    await rawClient.set("message:foo", "bar");

    const actualRecord = await redis.get(Feature.EMAIL, "foo");

    expect(actualRecord).toEqual("bar");
  });

  it("incr should append key to feature prefix", async () => {
    await rawClient.set("rate:foo", "42");

    await redis.incr(Feature.RATE_LIMIT, "foo");
    const actualRecord = await redis.get(Feature.RATE_LIMIT, "foo");

    expect(actualRecord).toEqual("43");
  });

  it("del should append key to feature prefix", async () => {
    await rawClient.set("message:foo", "bar");

    await redis.del(Feature.EMAIL, "foo");
    const actualRecord = await redis.get(Feature.EMAIL, "foo");

    expect(actualRecord).toBeNull();
  });

  it("ttl should append key to feature prefix", async () => {
    await rawClient
      .multi()
      .set("message:foo", "bar")
      .expire("message:foo", 42)
      .exec();

    const ttl = await redis.ttl(Feature.EMAIL, "foo");

    expect(ttl).toBeGreaterThan(40);
    expect(ttl).toBeLessThanOrEqual(42);
  });

  it("should append key to correct prefix for CLIENT_IP", async () => {
    await redis.set(Feature.CLIENT_IP, "foo", "bar");

    const actualRecord = await rawClient.get("clientIp:foo");

    expect(actualRecord).toEqual("bar");
  });

  it("should append key to correct prefix for RATE_LIMIT", async () => {
    await redis.set(Feature.RATE_LIMIT, "foo", "bar");

    const actualRecord = await rawClient.get("rate:foo");

    expect(actualRecord).toEqual("bar");
  });
});
