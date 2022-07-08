import { Factory } from "fishery";
import type { SessionUser } from "~/auth.server";

export const sessionUserFactory = Factory.define<SessionUser>(
  ({ sequence }) => ({
    id: sequence.toString(),
    email: "user@example.com",
    identified: false,
    inDeclarationProcess: true,
  })
);
