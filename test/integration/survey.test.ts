import { createSurvey } from "~/domain/survey";

describe("Survey", () => {
  it("should not return when survey is submitted", async () => {
    const newSurvey = await createSurvey("dropout", "nice survey");
    expect(newSurvey).toBeUndefined();
  });
});
