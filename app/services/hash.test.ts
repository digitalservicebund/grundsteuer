import { hash } from "./hash";

describe("hash", () => {
  it("returns sha1 hash in hex", async () => {
    expect(hash("hallo")).toEqual("fd4cef7a4e607f1fcc920ad6329a6df2df99a4e8");
  });
});
