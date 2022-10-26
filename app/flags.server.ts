import { unleash } from "~/unleash.server";

export type FlagFunction = () => boolean;

export type FlagFunctions = {
  isBundesIdentDown: FlagFunction;
  isEkonaDown: FlagFunction;
  isEricaDown: FlagFunction;
  isGrundsteuerDown: FlagFunction;
  isSendinblueDown: FlagFunction;
  isZammadDown: FlagFunction;
  getAllFlags: () => Flags;
};

export type Flags = {
  bundesIdentDown?: boolean;
  ekonaDown?: boolean;
  ericaDown?: boolean;
  grundsteuerDown?: boolean;
  sendinblueDown?: boolean;
  zammadDown?: boolean;
};

export type Service =
  | "bundesident"
  | "ekona"
  | "erica"
  | "grundsteuer"
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

const isGrundsteuerDown = () => {
  return isServiceDown("grundsteuer");
};

const isSendinblueDown = () => {
  return isServiceDown("sendinblue");
};

const isZammadDown = () => {
  return isServiceDown("zammad");
};

const getAllFlags = () => {
  return {
    bundesIdentDown: isBundesIdentDown(),
    ekonaDown: isEkonaDown(),
    ericaDown: isEricaDown(),
    grundsteuerDown: isGrundsteuerDown(),
    sendinblueDown: isSendinblueDown(),
    zammadDown: isZammadDown(),
  };
};

export const flags: FlagFunctions = {
  isBundesIdentDown,
  isEkonaDown,
  isEricaDown,
  isGrundsteuerDown,
  isSendinblueDown,
  isZammadDown,
  getAllFlags,
};
