require("@testing-library/jest-dom");

global.__unleash = {
  isEnabled: () => {
    return false;
  },
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  on: () => {},
};
