import { User } from "~/domain/user";
import { FscRequest } from "~/domain/fscRequest";

export const isIdentified = (user: User) => {
  return user.identified;
};

export const hasValidOpenFscRequest = (user: User) => {
  return (
    !user.identified &&
    user.fscRequest &&
    new FscRequest(user.fscRequest).isValid()
  );
};

export const canEnterFsc = (user: User) => {
  return (
    !user.identified && !user.ericaRequestIdFscStornieren && user.fscRequest
  );
};

export const needsToStartIdentification = (user: User) => {
  return !user.identified && !user.fscRequest;
};
