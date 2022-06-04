import { deleteExpiredFscs } from "~/cron.server";
import { db } from "~/db.server";

describe("Cron jobs", () => {
  describe("deleteExpiredFscs", () => {
    beforeAll(async () => {
      await db.user.create({
        data: {
          email: "one@foo.com",
          fscRequest: {
            create: {
              requestId: "under90daysold",
              createdAt: new Date(
                // 89 days and 23 hours ago
                new Date().setHours(new Date().getHours() - (90 * 24 - 1))
              ),
            },
          },
        },
      });
      await db.user.create({
        data: {
          email: "two@foo.com",
          fscRequest: {
            create: {
              requestId: "over90daysold",
              createdAt: new Date(
                // 90 days ago
                new Date().setHours(new Date().getHours() - 90 * 24)
              ),
            },
          },
        },
      });
    });
    afterAll(async () => {
      await db.fscRequest.deleteMany({
        where: { requestId: { in: ["over90daysold", "under90daysold"] } },
      });
      await db.user.deleteMany({
        where: { email: { in: ["one@foo.com", "two@foo.com"] } },
      });
    });

    it("should delete entry over 90 days old", async () => {
      const beforeRows = await db.fscRequest.findMany();
      expect(beforeRows.length).toEqual(2);

      await deleteExpiredFscs();

      const afterRows = await db.fscRequest.findMany();
      const requestIds = afterRows.map((row) => row.requestId);

      expect(requestIds.length).toEqual(1);
      expect(requestIds).toEqual(["under90daysold"]);
    });
  });
});

export {};
