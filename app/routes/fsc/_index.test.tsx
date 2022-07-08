import { getNextStepLink } from "~/routes/fsc/index";
import { sessionUserFactory } from "test/factories";

describe("getNextStepLink", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Returns summary if url param set", async () => {
    const user = sessionUserFactory.build();
    const result = await getNextStepLink(
      "localhost:3000/fsc?redirectToSummary=true",
      user
    );
    expect(result).toEqual("/formular/zusammenfassung");
  });

  it("Returns formular start if still inDeclarationProcess", async () => {
    const user = sessionUserFactory.build({ inDeclarationProcess: true });
    const result = await getNextStepLink("localhost:3000/fsc", user);
    expect(result).toEqual("/formular/welcome");
  });

  it("Returns formular erfolg if not inDeclarationProcess", async () => {
    const user = sessionUserFactory.build({ inDeclarationProcess: false });
    const result = await getNextStepLink("localhost:3000/fsc", user);
    expect(result).toEqual("/formular/erfolg");
  });
});
