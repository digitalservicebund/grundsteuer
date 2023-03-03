import { createSurvey } from "~/domain/survey";

describe("Survey", () => {
  it("should return when survey is submitted", async () => {
    const newSurvey = await createSurvey("dropout", "nice survey");
    expect(newSurvey).not.toBeUndefined();
    expect(newSurvey.category).toEqual("dropout");
    expect(newSurvey.content).toEqual("nice survey");
  });
});
