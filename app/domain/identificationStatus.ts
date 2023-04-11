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

export const canEnterFsc = (user: User): boolean => {
  return !!(
    !user.identified &&
    !user.ericaRequestIdFscStornieren &&
    user.fscRequest
  );
};

export const fscIsOlderThanOneDay = (user: User) => {
  return (
    user.fscRequest &&
    new FscRequest(user.fscRequest).remainingValidityInDays() < 90
  );
};

export const fscIsTooOld = (user: User) => {
  return user.fscRequest && !new FscRequest(user.fscRequest).isValid();
};

export const needsToStartIdentification = (user: User) => {
  return !user.identified && !user.fscRequest;
};

export const showBundesidentPrimayOptionPage = (
  bundesIdentIsOnline: boolean,
  hasPrimaryOptionShown: boolean,
  user: User
) => {
  return (
    bundesIdentIsOnline &&
    !hasPrimaryOptionShown &&
    needsToStartIdentification(user)
  );
};
