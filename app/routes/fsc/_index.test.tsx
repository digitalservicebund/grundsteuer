import { getNextStepLink } from "~/routes/fsc/index";

describe("getNextStepLink", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Returns summary if url param set", async () => {
    const result = await getNextStepLink(
      "localhost:3000/fsc?redirectToSummary=true"
    );
    expect(result).toEqual("/formular/zusammenfassung");
  });

  it("Returns formular start if no url param set", async () => {
    const result = await getNextStepLink("localhost:3000/fsc");
    expect(result).toEqual("/formular/welcome");
  });
});
