import { validateAllStepsData } from "./validation";
import { grundModelFactory } from "test/factories";
import _ from "lodash";

describe("validateAllStepData", () => {
  it("should return no errors on valid data", async () => {
    const data = _.merge(grundModelFactory.full().build(), {
      zusammenfassung: {
        confirmCompleteCorrect: "true",
        confirmDataPrivacy: "true",
        confirmTermsOfUse: "true",
      },
    });
    const result = await validateAllStepsData(data);

    expect(result).toEqual({});
  });

  it("should return errors on numbered steps", async () => {
    const data = _.merge(
      grundModelFactory
        .full()
        .eigentuemerPersonAdresse({
          strasse: "foo",
          hausnummer: "INVALID",
          plz: "123",
          ort: "wonderland",
        })
        .build(),
      {
        zusammenfassung: {
          confirmCompleteCorrect: "true",
          confirmDataPrivacy: "true",
          confirmTermsOfUse: "true",
        },
      }
    );
    const result = await validateAllStepsData(data);

    expect(Object.keys(result).length).toEqual(1);
  });
});
