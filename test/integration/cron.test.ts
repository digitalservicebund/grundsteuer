import {
  deleteExpiredAccounts,
  deleteExpiredPdfs,
  deleteExpiredTransfertickets,
  deleteOutdatedSurveyResults,
} from "~/cron.server";
import { db } from "~/db.server";
import * as freischaltCodeStornierenModule from "~/erica/freischaltCodeStornieren";
import { getMockedFunction } from "test/mocks/mockHelper";

describe("Cron jobs", () => {
  describe("deleteExpiredPdfs", () => {
    beforeAll(async () => {
      await db.user.create({
        data: {
          email: "one@foo.com",
          pdf: {
            create: {
              data: Buffer.from("over24HoursOld"),
              createdAt: new Date(
                // 24 hours ago
                new Date(Date.now() - 24 * 60 * 60 * 1000)
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
              data: Buffer.from("under24HoursOld"),
              createdAt: new Date(
                // 23 hours and 59 minutes ago
                new Date(Date.now() - 24 * 60 * 60 * 1000 + 60 * 1000)
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

    it("should delete pdf over 24 hours old", async () => {
      const beforeRows = await db.pdf.findMany();
      expect(beforeRows.length).toEqual(2);

      await deleteExpiredPdfs();

      const afterRows = await db.pdf.findMany();

      expect(afterRows.length).toEqual(1);
      expect(afterRows[0].data).toEqual(Buffer.from("under24HoursOld"));
    });
  });

  describe("deleteOutdatedSurveyResults", () => {
    beforeAll(async () => {
      await db.survey.create({
        data: {
          category: "success",
          content: "over24HoursOld",
          createdAt: new Date(
            // 24 hours ago
            new Date(Date.now() - 24 * 60 * 60 * 1000)
          ),
        },
      });
      await db.survey.create({
        data: {
          category: "success",
          content: "under24HoursOld",
          createdAt: new Date(
            // 23 hours and 59 minutes ago
            new Date(Date.now() - 24 * 60 * 60 * 1000 + 60 * 1000)
          ),
        },
      });
    });

    afterAll(async () => {
      await db.survey.deleteMany({});
    });

    it("should delete surveys over 24 hours old", async () => {
      const beforeRows = await db.survey.findMany();
      expect(beforeRows.length).toEqual(2);

      await deleteOutdatedSurveyResults();

      const afterRows = await db.survey.findMany();

      expect(afterRows.length).toEqual(1);
      expect(afterRows[0].content).toEqual("under24HoursOld");
    });
  });

  describe("deleteExpiredTransfertickets", () => {
    beforeAll(async () => {
      await db.user.create({
        data: {
          email: "one@foo.com",
          transferticket: "one",
          lastDeclarationAt: new Date(
            // 24 hours ago
            new Date(Date.now() - 24 * 60 * 60 * 1000)
          ),
        },
      });
      await db.user.create({
        data: {
          email: "two@foo.com",
          transferticket: "two",
          lastDeclarationAt: new Date(
            // 23 hours and 59 minutes ago
            new Date(Date.now() - 24 * 60 * 60 * 1000 + 60 * 1000)
          ),
        },
      });
    });

    afterAll(async () => {
      await db.user.deleteMany({
        where: { email: { in: ["one@foo.com", "two@foo.com"] } },
      });
    });

    it("should delete transfertickets over 24 hours old", async () => {
      const beforeRows = await db.user.findMany({
        where: {
          NOT: { transferticket: null },
        },
      });

      expect(beforeRows.length).toEqual(2);

      await deleteExpiredTransfertickets();

      const afterRows = await db.user.findMany({
        where: {
          NOT: { transferticket: null },
        },
      });

      expect(afterRows.length).toEqual(1);
      expect(afterRows[0].transferticket).toEqual("two");
    });
  });

  describe("deleteExpiredAccounts", () => {
    let spyOnRevokeFsc: jest.SpyInstance;
    beforeAll(() => {
      spyOnRevokeFsc = getMockedFunction(
        freischaltCodeStornierenModule,
        "revokeFreischaltCode",
        { location: "007" }
      );
    });
    afterAll(() => {
      spyOnRevokeFsc.mockRestore();
    });
    describe("With realistic database state", () => {
      beforeEach(async () => {
        spyOnRevokeFsc.mockClear();
        await db.user.create({
          data: {
            email: "created-new@foo.com",
            createdAt: new Date(
              // 6 months ago
              new Date().setMonth(new Date().getMonth() - 6)
            ),
            fscRequest: {
              create: {
                requestId: "newRequestId",
              },
            },
          },
        });
        await db.user.create({
          data: {
            email: "created-old@foo.com",
            createdAt: new Date(
              // 7 months ago
              new Date().setMonth(new Date().getMonth() - 7)
            ),
            fscRequest: {
              create: {
                createdAt: new Date(
                  // 7 months ago
                  new Date().setMonth(new Date().getMonth() - 7)
                ),
                requestId: "oldRequestId",
              },
            },
          },
        });
        await db.user.create({
          data: {
            email: "fsc-request-new@foo.com",
            createdAt: new Date(
              // 7 months ago
              new Date().setMonth(new Date().getMonth() - 7)
            ),
            fscRequest: {
              create: {
                createdAt: new Date(
                  // 4 months ago
                  new Date().setMonth(new Date().getMonth() - 4)
                ),
                requestId: "requestId",
              },
            },
          },
        });
        await db.user.create({
          data: {
            email: "identified-new@foo.com",
            identified: true,
            identifiedAt: new Date(
              // 6 months ago
              new Date().setMonth(new Date().getMonth() - 6)
            ),
          },
        });
        await db.user.create({
          data: {
            email: "identified-old@foo.com",
            identified: true,
            identifiedAt: new Date(
              // 7 months ago
              new Date().setMonth(new Date().getMonth() - 7)
            ),
          },
        });
        await db.user.create({
          data: {
            email: "declaration-new@foo.com",
            transferticket: "tt",
            lastDeclarationAt: new Date(
              // 6 months ago
              new Date().setMonth(new Date().getMonth() - 6)
            ),
          },
        });
        await db.user.create({
          data: {
            email: "declaration-old@foo.com",
            transferticket: "tt",
            lastDeclarationAt: new Date(
              // 7 months ago
              new Date().setMonth(new Date().getMonth() - 7)
            ),
          },
        });
      });

      afterEach(async () => {
        await db.auditLogV2.deleteMany({});
        await db.fscRequest.deleteMany({});
        await db.pdf.deleteMany({});
        await db.user.deleteMany({
          where: {
            email: {
              in: [
                "created-new@foo.com",
                "created-old@foo.com",
                "identified-new@foo.com",
                "identified-old@foo.com",
                "declaration-new@foo.com",
                "declaration-old@foo.com",
                "fsc-request-new@foo.com",
              ],
            },
          },
        });
      });

      it("should delete entries over seven months old", async () => {
        const beforeRows = await db.user.findMany();
        expect(beforeRows.length).toEqual(8); // including seeded 'foo@bar.com'

        try {
          await deleteExpiredAccounts();
        } catch (e) {
          const afterRows = await db.user.findMany();
          expect(afterRows.length).toEqual(8);
        }

        const afterRows = await db.user.findMany();
        expect(afterRows.length).toEqual(5);

        const remainingEmails = afterRows.map((row) => row.email);
        const expectedEmails = [
          "foo@bar.com",
          "created-new@foo.com",
          "identified-new@foo.com",
          "declaration-new@foo.com",
          "fsc-request-new@foo.com",
        ];
        expect(remainingEmails.sort()).toEqual(expectedEmails.sort());
      });

      it("should add audit logs", async () => {
        const beforeRows = await db.auditLogV2.findMany();
        expect(beforeRows.length).toEqual(0);

        await deleteExpiredAccounts();

        const afterRows = await db.auditLogV2.findMany();
        expect(afterRows.length).toEqual(3);
      });

      it("should revoke existing fsc", async () => {
        await deleteExpiredAccounts();

        expect(spyOnRevokeFsc).toHaveBeenCalledWith("oldRequestId");
        expect(spyOnRevokeFsc).toHaveBeenCalledTimes(1);
      });
    });

    describe("with outstanding pdf", () => {
      beforeEach(async () => {
        spyOnRevokeFsc.mockClear();
        await db.user.create({
          data: {
            email: "created-new@foo.com",
            createdAt: new Date(
              // 6 months ago
              new Date().setMonth(new Date().getMonth() - 6)
            ),
          },
        });
        await db.user.create({
          data: {
            email: "created-old@foo.com",
            createdAt: new Date(
              // 7 months ago
              new Date().setMonth(new Date().getMonth() - 7)
            ),
            fscRequest: {
              create: {
                createdAt: new Date(
                  // 7 months ago
                  new Date().setMonth(new Date().getMonth() - 7)
                ),
                requestId: "oldRequestId",
              },
            },
          },
        });
        // Having a pdf raises an error when trying to delete the account
        await db.user.create({
          data: {
            email: "created-old-with-pdf@foo.com",
            createdAt: new Date(
              // 7 months ago
              new Date().setMonth(new Date().getMonth() - 7)
            ),
            pdf: {
              create: {
                data: Buffer.from("PDF"),
              },
            },
          },
        });
      });

      afterEach(async () => {
        await db.auditLogV2.deleteMany({});
        await db.fscRequest.deleteMany({});
        await db.pdf.deleteMany({});
        await db.user.deleteMany({
          where: {
            email: {
              in: [
                "created-new@foo.com",
                "created-old@foo.com",
                "created-old-with-pdf@foo.com",
              ],
            },
          },
        });
      });

      it("should not delete any user entries", async () => {
        const beforeRows = await db.user.findMany();
        expect(beforeRows.length).toEqual(4); // including seeded 'foo@bar.com'

        await deleteExpiredAccounts();

        const afterRows = await db.user.findMany();
        expect(afterRows.length).toEqual(4);

        const remainingEmails = afterRows.map((row) => row.email);
        const expectedEmails = [
          "foo@bar.com",
          "created-new@foo.com",
          "created-old@foo.com",
          "created-old-with-pdf@foo.com",
        ];
        expect(remainingEmails.sort()).toEqual(expectedEmails.sort());
      });

      it("should not change pdf entries", async () => {
        const beforeRows = await db.pdf.findMany();
        expect(beforeRows.length).toEqual(1);

        await deleteExpiredAccounts();

        const afterRows = await db.pdf.findMany();
        expect(afterRows.length).toEqual(1);
      });

      it("should add no audit logs", async () => {
        const beforeRows = await db.auditLogV2.findMany();
        expect(beforeRows.length).toEqual(0);

        await deleteExpiredAccounts();

        const afterRows = await db.auditLogV2.findMany();
        expect(afterRows.length).toEqual(0);
      });

      it("should revoke existing fsc", async () => {
        await deleteExpiredAccounts();

        expect(spyOnRevokeFsc).toHaveBeenCalledWith("oldRequestId");
        expect(spyOnRevokeFsc).toHaveBeenCalledTimes(1);
      });
    });
  });
});

export {};
