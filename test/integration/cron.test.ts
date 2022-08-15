import {
  deleteExpiredAccounts,
  deleteExpiredFscs,
  deleteExpiredPdfs,
} from "~/cron.server";
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

  describe("deleteExpiredAccounts", () => {
    beforeAll(async () => {
      await db.user.create({
        data: {
          email: "createdNew@foo.com",
          createdAt: new Date(
            // 3 months ago
            new Date().setMonth(new Date().getMonth() - 3)
          ),
        },
      });
      await db.user.create({
        data: {
          email: "createdOld@foo.com",
          createdAt: new Date(
            // 4 months ago
            new Date().setMonth(new Date().getMonth() - 4)
          ),
        },
      });
      await db.user.create({
        data: {
          email: "identifiedNew@foo.com",
          identified: true,
          identifiedAt: new Date(
            // 3 months ago
            new Date().setMonth(new Date().getMonth() - 3)
          ),
        },
      });
      await db.user.create({
        data: {
          email: "identifiedOld@foo.com",
          identified: true,
          identifiedAt: new Date(
            // 4 months ago
            new Date().setMonth(new Date().getMonth() - 4)
          ),
        },
      });
      await db.user.create({
        data: {
          email: "declarationNew@foo.com",
          transferticket: "tt",
          lastDeclarationAt: new Date(
            // 3 months ago
            new Date().setMonth(new Date().getMonth() - 3)
          ),
        },
      });
      await db.user.create({
        data: {
          email: "declarationOld@foo.com",
          transferticket: "tt",
          lastDeclarationAt: new Date(
            // 4 months ago
            new Date().setMonth(new Date().getMonth() - 4)
          ),
        },
      });
    });

    afterAll(async () => {
      await db.user.deleteMany({
        where: {
          email: {
            in: [
              "createdNew@foo.com",
              "createdOld@foo.com",
              "identifiedNew@foo.com",
              "identifiedOld@foo.com",
              "declarationNew@foo.com",
              "declarationOld@foo.com",
            ],
          },
        },
      });
    });

    it("should delete entries over four months old", async () => {
      const beforeRows = await db.user.findMany();
      expect(beforeRows.length).toEqual(7); // including seeded 'foo@bar.com'

      await deleteExpiredAccounts();

      const afterRows = await db.user.findMany();
      expect(afterRows.length).toEqual(4);
      expect(afterRows[0].email).toEqual("foo@bar.com");
      expect(afterRows[1].email).toEqual("createdNew@foo.com");
      expect(afterRows[2].email).toEqual("identifiedNew@foo.com");
      expect(afterRows[3].email).toEqual("declarationNew@foo.com");
    });
  });
});

export {};
