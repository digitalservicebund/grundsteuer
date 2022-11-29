import { sanitizeStepFormData } from "~/util/sanitizeStepFormData";

describe("sanitizeStepFormData", function () {
  it("keeps allowed chars", () => {
    const expected = {
      allowed:
        "! \" # $ % & ' ( ) * + , - . /  \n  0 1 2 3 456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`abcdefghijklmnopqrstuvwxyz{|}~¡¢£¥§ª«¬®¯°±²³µ¹º»¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿŒœŠšŸŽža€",
    };
    const result = sanitizeStepFormData(expected);
    expect(result).toEqual(expected);
  });

  it("removes forbidden characters", () => {
    const expected = {
      forbiddenChars: "ABC",
    };
    const result = sanitizeStepFormData({
      forbiddenChars: "A\u1f60B\u1100C",
    });
    expect(result).toEqual(expected);
  });
});
