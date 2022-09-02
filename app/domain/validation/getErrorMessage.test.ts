import { getErrorMessage } from "~/domain/validation/getErrorMessage";
import { ValidationConfig } from "~/domain/validation";
import { grundModelFactory } from "test/factories";

describe("getErrorMessage", () => {
  it("should return error message from i18n if defined and is nonempty", () => {
    const config: ValidationConfig = { required: {} };
    const i18n = { required: "some message" };
    const allData = grundModelFactory.full().build();
    const result = getErrorMessage("", config, {}, allData, i18n);

    expect(result).toBeTruthy();
    expect(result).toEqual("some message");
  });

  it("should return error message from config if defined", () => {
    const config: ValidationConfig = { required: { msg: "overriden" } };
    const i18n = { required: "some message" };
    const allData = grundModelFactory.full().build();
    const result = getErrorMessage("", config, {}, allData, i18n);

    expect(result).toBeTruthy();
    expect(result).toEqual("overriden");
  });

  it("should return fallback error message if i18n defined but empty", () => {
    const config: ValidationConfig = { required: {} };
    const i18n = { required: "" };
    const allData = grundModelFactory.full().build();
    const result = getErrorMessage("", config, {}, allData, i18n);

    expect(result).toBeTruthy();
  });

  it("should return fallback error message if i18n undefined", () => {
    const config: ValidationConfig = { required: {} };
    const i18n = {};
    const allData = grundModelFactory.full().build();
    const result = getErrorMessage("", config, {}, allData, i18n);

    expect(result).toBeTruthy();
  });
});
