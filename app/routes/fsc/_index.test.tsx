import { getNextStepLink } from "~/routes/fsc/index";
import { getMockedFunction } from "test/mocks/mockHelper";
import * as userModule from "~/domain/user";

describe("getNextStepLink", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("Returns summary if url param set", async () => {
    const result = await getNextStepLink(
      "localhost:3000/fsc?redirectToSummary=true",
      "foo@bar.com"
    );
    expect(result).toEqual("/formular/zusammenfassung");
  });

  it("Returns formular start if still inDeclarationProcess", async () => {
    getMockedFunction(userModule, "findUserByEmail", {
      email: "existing_user@foo.com",
      inDeclarationProcess: true,
    });
    const result = await getNextStepLink("localhost:3000/fsc", "foo@bar.com");
    expect(result).toEqual("/formular/welcome");
  });

  it("Returns formular erfolg if not inDeclarationProcess", async () => {
    getMockedFunction(userModule, "findUserByEmail", {
      email: "existing_user@foo.com",
      inDeclarationProcess: false,
    });
    const result = await getNextStepLink("localhost:3000/fsc", "foo@bar.com");
    expect(result).toEqual("/formular/erfolg");
  });
});
