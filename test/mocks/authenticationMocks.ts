import { getSession } from "~/session.server";
import { authenticator } from "~/auth.server";

jest.mock("~/auth.server", () => {
  return {
    __esModule: true,
    authenticator: {
      isAuthenticated: jest.fn(),
    },
  };
});

export const getAuthenticatedSession = async (userMail: string) => {
  const session = await getSession();
  session.set("user", { email: userMail, id: 1 });

  return session;
};

export const mockIsAuthenticated =
  authenticator.isAuthenticated as jest.MockedFunction<
    typeof authenticator.isAuthenticated
  >;
