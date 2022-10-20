export type FlagFunction = () => boolean;

export type FlagFunctions = {
  isEkonaDown: FlagFunction;
  isEricaDown: FlagFunction;
  isSendinblueDown: FlagFunction;
  isZammadDown: FlagFunction;
  getAllFlags: () => Flags;
};

export type Flags = {
  ekonaDown?: boolean;
  ericaDown?: boolean;
  sendinblueDown?: boolean;
  zammadDown?: boolean;
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

const isZammadDown = () => {
  return isServiceDown(process.env.ZAMMAD_DOWN);
};

const getAllFlags = () => {
  return {
    ekonaDown: isEkonaDown(),
    ericaDown: isEricaDown(),
    sendinblueDown: isSendinblueDown(),
    zammadDown: isZammadDown(),
  };
};

export const flags: FlagFunctions = {
  isEkonaDown,
  isEricaDown,
  isSendinblueDown,
  isZammadDown,
  getAllFlags,
};
