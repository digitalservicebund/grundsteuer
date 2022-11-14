import { useid } from "~/useid/useid";
import * as useidModule from "~/useid/useid";
import { getMockedFunction } from "test/mocks/mockHelper";
import { Identity } from "useid-eservice-sdk/dist/Identity";

describe("With valid data returned", () => {
  const correctUseidReturnData = new Identity({
    personalData: {
      placeOfResidence: {
        structuredPlace: {
          street: "Hogwartsroad",
          zipCode: "77777",
          city: "Hogsmeade",
          country: "Great Britain",
        },
      },
      givenNames: "Rubeus",
      familyNames: "Hagrid",
    },
  });

  beforeAll(() => {
    getMockedFunction(useidModule, "getIdentity", correctUseidReturnData);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("returns the correct data", async () => {
    const expectedParsedData = {
      firstName: "Rubeus",
      lastName: "Hagrid",
      street: "Hogwartsroad",
      postalCode: "77777",
      city: "Hogsmeade",
      country: "Great Britain",
    };

    const result = await useid.getIdentityData("42");

    expect(result).toEqual(expectedParsedData);
  });
});

describe("With incomplete data returned", () => {
  const cases = [
    { description: "No data", data: {} },
    {
      description: "No street",
      data: {
        personalData: {
          placeOfResidence: {
            structuredPlace: {
              zipCode: "77777",
              city: "Hogsmeade",
              country: "Great Britain",
            },
          },
          givenNames: "Rubeus",
          familyNames: "Hagrid",
        },
      },
    },
    {
      description: "no zipCode",
      data: {
        personalData: {
          placeOfResidence: {
            structuredPlace: {
              street: "Hogwartsroad",
              city: "Hogsmeade",
              country: "Great Britain",
            },
          },
          givenNames: "Rubeus",
          familyNames: "Hagrid",
        },
      },
    },
    {
      description: "no city",
      data: {
        personalData: {
          placeOfResidence: {
            structuredPlace: {
              street: "Hogwartsroad",
              zipCode: "77777",
              country: "Great Britain",
            },
          },
          givenNames: "Rubeus",
          familyNames: "Hagrid",
        },
      },
    },
    {
      description: "no country",
      data: {
        personalData: {
          placeOfResidence: {
            structuredPlace: {
              street: "Hogwartsroad",
              zipCode: "77777",
              city: "Hogsmeade",
            },
          },
          givenNames: "Rubeus",
          familyNames: "Hagrid",
        },
      },
    },
    {
      description: "no first name",
      data: {
        personalData: {
          placeOfResidence: {
            structuredPlace: {
              street: "Hogwartsroad",
              zipCode: "77777",
              city: "Hogsmeade",
              country: "Great Britain",
            },
          },
          familyNames: "Hagrid",
        },
      },
    },
    {
      description: "no last name",
      data: {
        personalData: {
          placeOfResidence: {
            structuredPlace: {
              street: "Hogwartsroad",
              zipCode: "77777",
              city: "Hogsmeade",
              country: "Great Britain",
            },
          },
          givenNames: "Rubeus",
        },
      },
    },
  ];

  test.each(cases)("Should throw error if '$description'", async ({ data }) => {
    getMockedFunction(useidModule, "getIdentity", data);
    await expect(
      async () => await useid.getIdentityData("42")
    ).rejects.toThrow();
  });
});
