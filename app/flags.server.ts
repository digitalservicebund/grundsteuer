export type FlagFunction = () => boolean;

export type FlagFunctions = {
  isEkonaDown: FlagFunction;
  isEricaDown: FlagFunction;
};

const isEkonaDown = () => {
  return process.env.EKONA_DOWN === "true" || false;
};

const isEricaDown = () => {
  return process.env.ERICA_DOWN === "true" || false;
};

export const flags: FlagFunctions = { isEkonaDown, isEricaDown };
