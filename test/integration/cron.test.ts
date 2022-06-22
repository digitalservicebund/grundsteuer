import { deleteExpiredFscs, deleteExpiredPdfs } from "~/cron.server";
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

  describe("deleteExpiredPdfs", () => {
    beforeAll(async () => {
      await db.user.create({
        data: {
          email: "one@foo.com",
          pdf: {
            create: {
              data: Buffer.from("overOneHourOld"),
              createdAt: new Date(
                // 60 minutes ago
                new Date().setMinutes(new Date().getMinutes() - 60)
              ),
            },
          },
        },
      });
      await db.user.create({
        data: {
          email: "two@foo.com",
          pdf: {
            create: {
              data: Buffer.from("underOneHourOld"),
              createdAt: new Date(
                // 59 minutes ago
                new Date().setMinutes(new Date().getMinutes() - 59)
              ),
            },
          },
        },
      });
    });
    afterAll(async () => {
      await db.pdf.deleteMany({});
      await db.user.deleteMany({
        where: { email: { in: ["one@foo.com", "two@foo.com"] } },
      });
    });

    it("should delete entry over one hour old", async () => {
      const beforeRows = await db.pdf.findMany();
      expect(beforeRows.length).toEqual(2);

      await deleteExpiredPdfs();

      const afterRows = await db.pdf.findMany();

      expect(afterRows.length).toEqual(1);
      expect(afterRows[0].data).toEqual(Buffer.from("underOneHourOld"));
    });
  });
});

export {};
