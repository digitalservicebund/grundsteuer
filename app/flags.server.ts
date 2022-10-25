import { unleash } from "~/unleash.server";

export type FlagFunction = () => boolean;

export type FlagFunctions = {
  isEkonaDown: FlagFunction;
  isEricaDown: FlagFunction;
  isBundesIdentDown: FlagFunction;
  isSendinblueDown: FlagFunction;
  isZammadDown: FlagFunction;
  getAllFlags: () => Flags;
};

export type Flags = {
  ekonaDown?: boolean;
  ericaDown?: boolean;
  bundesIdentDown?: boolean;
  sendinblueDown?: boolean;
  zammadDown?: boolean;
};

export type Service =
  | "bundesident"
  | "ekona"
  | "erica"
  | "sendinblue"
  | "zammad";

const isServiceDown = (service: Service | undefined) => {
  if (service === undefined) return false;
  return unleash.isEnabled("grundsteuer." + service + "_down") || false;
};

const isEkonaDown = () => {
  return isServiceDown("ekona");
};

const isEricaDown = () => {
  return isServiceDown("erica");
};

const isBundesIdentDown = () => {
  return isServiceDown("bundesident");
};

const isSendinblueDown = () => {
  return isServiceDown("sendinblue");
};

const isZammadDown = () => {
  return isServiceDown("zammad");
};

const getAllFlags = () => {
  return {
    ekonaDown: isEkonaDown(),
    ericaDown: isEricaDown(),
    bundesIdentDown: isBundesIdentDown(),
    sendinblueDown: isSendinblueDown(),
    zammadDown: isZammadDown(),
  };
};

export const flags: FlagFunctions = {
  isEkonaDown,
  isEricaDown,
  isBundesIdentDown,
  isSendinblueDown,
  isZammadDown,
  getAllFlags,
};
