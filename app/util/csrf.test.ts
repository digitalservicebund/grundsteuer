import { Session } from "@remix-run/node";
import {
  appendCsrfToken,
  createCsrfToken,
  formTokenIsValid,
  SESSION_KEY,
} from "./csrf";
import { createSession } from "@remix-run/node";

describe("appendCsrfToken", () => {
  describe("with empty session", () => {
    test("token is added", () => {
      const session: Session = createSession({});
      const token = "newToken";
      appendCsrfToken(session, token);
      expect(session.has(SESSION_KEY)).toBe(true);
      expect(JSON.parse(session.get(SESSION_KEY))).toEqual([token]);
    });
  });

  describe("with existing tokens in session", () => {
    test("token is prepended and max 5 tokens are kept", () => {
      const fourTokens = ["token1", "token2", "token3", "token4"];
      const session: Session = createSession({
        [SESSION_KEY]: JSON.stringify([...fourTokens, "token5"]),
      });
      const token = "newToken";
      appendCsrfToken(session, token);
      expect(JSON.parse(session.get(SESSION_KEY))).toEqual([
        token,
        ...fourTokens,
      ]);
    });
  });

  describe("with an old existing string token in session", () => {
    test("token is prepended", () => {
      const existingToken = "existingToken";
      const session: Session = createSession({ [SESSION_KEY]: existingToken });
      const token = "newToken";
      appendCsrfToken(session, token);
      expect(JSON.parse(session.get(SESSION_KEY))).toEqual([
        token,
        existingToken,
      ]);
    });
  });
});

describe("createCsrfToken", () => {
  test("token of length 36 is added to session", () => {
    const session: Session = createSession({});
    const token = createCsrfToken(session);
    expect(session.has(SESSION_KEY)).toBe(true);
    expect(token.length).toEqual(36);
  });
});

describe("formTokenIsValid", () => {
  describe("with empty session", () => {
    test("it is invalid", () => {
      const session: Session = createSession({});
      const formToken = "formToken";
      expect(formTokenIsValid(session, formToken)).toBe(false);
    });
  });

  describe("with matching token in session", () => {
    test("it is valid", () => {
      const formToken = "formToken";
      const session: Session = createSession({
        [SESSION_KEY]: JSON.stringify(["token1", "token2", formToken]),
      });
      expect(formTokenIsValid(session, formToken)).toBe(true);
    });
  });

  describe("with an old matching string token in session", () => {
    test("it is valid", () => {
      const formToken = "formToken";
      const session: Session = createSession({ [SESSION_KEY]: formToken });
      expect(formTokenIsValid(session, formToken)).toBe(true);
    });
  });

  describe("with an old not matching string token in session", () => {
    test("it is invalid", () => {
      const formToken = "formToken";
      const session: Session = createSession({
        [SESSION_KEY]: "notMatchingToken",
      });
      expect(formTokenIsValid(session, formToken)).toBe(false);
    });
  });
});
