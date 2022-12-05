import * as fetchModule from "cross-fetch";
import { sendMail } from "./sendMail";

const args = {
  to: "email",
  subject: "subject",
  textContent: "text",
  htmlContent: "html",
};

const responseIs = jest.spyOn(fetchModule, "default").mockResolvedValueOnce;

const successfulResponse = {
  ok: true,
  json: () => Promise.resolve({ messageId: "id" }),
} as Response;

describe("sendMail", () => {
  it("properly calls Sendinblue API", async () => {
    const spy = responseIs(successfulResponse).mockClear();
    await sendMail(args);
    expect(spy.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "https://api.sendinblue.com/v3/smtp/email",
        Object {
          "body": "{\\"sender\\":{\\"name\\":\\"Grundsteuererklärung für Privateigentum\\",\\"email\\":\\"no-reply@mail.grundsteuererklaerung-fuer-privateigentum.de\\"},\\"replyTo\\":{\\"email\\":\\"hilfe@grundsteuererklaerung-fuer-privateigentum.de\\"},\\"subject\\":\\"subject\\",\\"to\\":[{\\"email\\":\\"email\\"}],\\"textContent\\":\\"text\\",\\"htmlContent\\":\\"html\\",\\"headers\\":{\\"X-List-Unsub\\":\\"disabled\\"}}",
          "headers": Object {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "api-key": undefined,
          },
          "method": "POST",
        },
      ]
    `);
  });

  it("properly includes optional attachments in Sendinblue API call", async () => {
    const spy = responseIs(successfulResponse).mockClear();
    await sendMail({
      ...args,
      attachments: [
        {
          name: "filename.txt",
          content: "aGVsbG8hCg==",
        },
      ],
    });
    const requestBody = JSON.parse(spy.mock.calls[0][1]?.body as string);
    expect(requestBody.attachment).toMatchInlineSnapshot(`
      Array [
        Object {
          "content": "aGVsbG8hCg==",
          "name": "filename.txt",
        },
      ]
    `);
  });

  it("returns expected value", async () => {
    responseIs(successfulResponse);
    const result = await sendMail(args);
    expect(result).toMatchInlineSnapshot(`
      Object {
        "messageId": "id",
        "to": "email",
      }
    `);
  });

  describe("when Sendinblue returns non-2xx response (most likely temporary problem)", () => {
    it("throw, so we can for example retry it", async () => {
      responseIs({
        ok: false,
        status: 500,
        statusText: "Internal server error.",
      } as Response);
      await expect(
        async () => await sendMail(args)
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Sendinblue returned non-2xx response: 500 Internal server error."`
      );
    });
  });

  describe("when Sendinblue response has no messageId", () => {
    it("throws, so we get informed and can investigate", async () => {
      responseIs({
        ok: true,
        json: async () => Promise.resolve({}), // no messageId
      } as Response);
      await expect(
        async () => await sendMail(args)
      ).rejects.toThrowErrorMatchingInlineSnapshot(
        `"Invariant failed: Expected Sendinblue to return messageId."`
      );
    });
  });
});
