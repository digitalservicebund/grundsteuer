export type FlagFunction = () => boolean;

export type FlagFunctions = {
  isEkonaDown: FlagFunction;
  isEricaDown: FlagFunction;
  isSendinblueDown: FlagFunction;
};

const isServiceDown = (flag: string | undefined) => {
  return flag === "true" || false;
};

const isEkonaDown = () => {
  return isServiceDown(process.env.EKONA_DOWN);
};

const isEricaDown = () => {
  return isServiceDown(process.env.ERICA_DOWN);
};

const isSendinblueDown = () => {
  return isServiceDown(process.env.SENDINBLUE_DOWN);
};

export const flags: FlagFunctions = {
  isEkonaDown,
  isEricaDown,
  isSendinblueDown,
};
