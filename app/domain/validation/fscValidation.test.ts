import { i18Next } from "~/i18n.server";
import {
  getErrorMessageForFreischaltcode,
  getErrorMessageForGeburtsdatum,
  getErrorMessageForSteuerId,
  validateFreischaltCode,
} from "~/domain/validation/fscValidation";

describe("getErrorMessageForFreischaltcode", () => {
  let i18n: Record<string, Record<string, string> | string>;

  beforeAll(async () => {
    const tFunction = await i18Next.getFixedT("de", "all");
    i18n = { ...(tFunction("errors") as object) };
  });

  it("should succeed with correctly formatted FreischaltCode", async () => {
    expect(
      await getErrorMessageForFreischaltcode("ABCD-ABCD-ABCD")
    ).toBeUndefined();
  });

  it("should fail without FreischaltCode", async () => {
    expect(await getErrorMessageForFreischaltcode("")).toEqual(
      i18n["required"] as string
    );
  });

  it("should fail with too long FreischaltCode", async () => {
    expect(await getErrorMessageForFreischaltcode("ABCD-ABCD-ABCDD")).toEqual(
      i18n["isFreischaltCode"] as string
    );
  });

  it("should fail with too short FreischaltCode", async () => {
    expect(await getErrorMessageForFreischaltcode("ABCD-ABCD-ABC")).toEqual(
      i18n["isFreischaltCode"] as string
    );
  });

  it("should fail with incorrect format", async () => {
    expect(await getErrorMessageForFreischaltcode("INCORRECT_FORMAT")).toEqual(
      i18n["isFreischaltCode"] as string
    );
  });
});

describe("validateFreischaltCode", () => {
  it("should succeed with a freischaltCode in the correct format", () => {
    expect(validateFreischaltCode({ value: "ABC1-DEF2-3456" })).toBeTruthy();
  });

  it("should succeed with a freischaltCode with only letters", () => {
    expect(validateFreischaltCode({ value: "ABCD-DEFG-HIJK" })).toBeTruthy();
  });

  it("should succeed with a freischaltCode with only digits", () => {
    expect(validateFreischaltCode({ value: "1234-5678-0123" })).toBeTruthy();
  });

  it("should fail if no dashes", () => {
    expect(validateFreischaltCode({ value: "ABC1DEF23456" })).toBeFalsy();
  });

  it("should fail if lowercase", () => {
    expect(validateFreischaltCode({ value: "abc1-def2-3456" })).toBeFalsy();
  });

  it("should fail with incorrect chars", () => {
    expect(validateFreischaltCode({ value: "ABC!-????-3456" })).toBeFalsy();
  });

  it("should fail with empty string", () => {
    expect(validateFreischaltCode({ value: "" })).toBeFalsy();
  });
});

describe("getErrorMessageForGeburtsdatum", () => {
  let i18n: Record<string, Record<string, string> | string>;

  beforeAll(async () => {
    const tFunction = await i18Next.getFixedT("de", "all");
    i18n = { ...(tFunction("errors") as object) };
  });

  it("should return undefined with correct German date", async () => {
    expect(await getErrorMessageForGeburtsdatum("01.01.2001")).toBeUndefined();
  });

  it("should fail without Geburtsdatum", async () => {
    expect(await getErrorMessageForGeburtsdatum("")).toEqual(
      i18n["required"] as string
    );
  });

  it("should fail with incorrect date", async () => {
    expect(await getErrorMessageForGeburtsdatum("32.01.2001")).toEqual(
      (i18n["geburtsdatum"] as Record<string, string>)["wrongFormat"]
    );
  });

  it("should fail with incorrect format", async () => {
    expect(await getErrorMessageForGeburtsdatum("2001-01-01")).toEqual(
      (i18n["geburtsdatum"] as Record<string, string>)["wrongFormat"]
    );
  });

  it("should fail with date in future", async () => {
    const actualNowImplementation = Date.now;
    try {
      Date.now = jest.fn(() => new Date(Date.UTC(2002, 0, 1)).valueOf());
      expect(await getErrorMessageForGeburtsdatum("02.01.2002")).toEqual(
        (i18n["geburtsdatum"] as Record<string, string>)["notInPast"]
      );
    } finally {
      Date.now = actualNowImplementation;
    }
  });
});

describe("getErrorMessageForSteuerId", () => {
  let i18n: Record<string, Record<string, string> | string>;

  beforeAll(async () => {
    const tFunction = await i18Next.getFixedT("de", "all");
    i18n = { ...(tFunction("errors") as object) };
  });

  it("should succeed with TestSteuerId", async () => {
    expect(await getErrorMessageForSteuerId("04452397687")).toBeFalsy();
  });

  it("should succeed with correct SteuerId", async () => {
    expect(await getErrorMessageForSteuerId("34285296716")).toBeFalsy();
  });

  it("should fail with incorrect SteuerId", async () => {
    expect(await getErrorMessageForSteuerId("34285296719")).toEqual(
      i18n["isSteuerId"] as string
    );
  });

  it("should fail without SteuerId", async () => {
    expect(await getErrorMessageForSteuerId("")).toEqual(
      i18n["required"] as string
    );
  });

  it("should fail with too long SteuerId", async () => {
    expect(await getErrorMessageForSteuerId("3428529671912")).toEqual(
      (i18n["steuerId"] as Record<string, string>)["wrongLength"]
    );
  });

  it("should fail with too short SteuerId", async () => {
    expect(await getErrorMessageForSteuerId("3428529671")).toEqual(
      (i18n["steuerId"] as Record<string, string>)["wrongLength"]
    );
  });

  it("should fail with not only digits in SteuerId", async () => {
    expect(await getErrorMessageForSteuerId("AB285296719")).toEqual(
      (i18n["steuerId"] as Record<string, string>)["onlyNumbers"]
    );
  });
});
