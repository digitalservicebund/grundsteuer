export type FlagFunction = () => boolean;

export type FlagFunctions = {
  isEkonaDown: FlagFunction;
};

const isEkonaDown = () => {
  return process.env.EKONA_DOWN === "true" || false;
};

export const flags: FlagFunctions = { isEkonaDown };
