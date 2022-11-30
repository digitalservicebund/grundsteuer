import { printHello } from "./printHello";

describe("service printHello", () => {
  describe("with name != error", () => {
    it("logs to console", async () => {
      const logSpy = jest.spyOn(console, "log");
      await printHello({ name: "Chewbacca" });
      expect(logSpy).toHaveBeenCalledWith("Hello, Chewbacca!");
    });
  });

  describe("with name = error", () => {
    it("throws", async () => {
      await expect(async () => {
        await printHello({ name: "error" });
      }).rejects.toThrow();
    });
  });
});
