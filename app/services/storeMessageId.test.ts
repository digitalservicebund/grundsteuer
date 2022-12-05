import { redis } from "~/redis/redis.server";
import { storeMessageId } from "./storeMessageId";

jest.mock("~/redis/redis.server");

const args = {
  to: "email",
  messageId: "id",
};

describe("storeMessageId", () => {
  it("properly calls redis.set with a hashed messageId", async () => {
    const spy = jest.spyOn(redis, "set").mockClear();
    await storeMessageId(args);
    expect(spy.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "email",
        "a88b7dcd1a9e3e17770bbaa6d7515b31a2d7e85d",
        "{\\"email\\":\\"email\\",\\"messageId\\":\\"87ea5dfc8b8e384d848979496e706390b497e547\\"}",
        3600,
      ]
    `);
  });
});
