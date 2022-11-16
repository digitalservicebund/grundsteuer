import { unleash } from "~/unleash.server";

export type FlagFunction = () => boolean;

export type FlagFunctions = {
  isBundesIdentDisabled: FlagFunction;
  isBundesIdentDown: FlagFunction;
  isEkonaDown: FlagFunction;
  isEricaDown: FlagFunction;
  isGrundsteuerDown: FlagFunction;
  isSendinblueDown: FlagFunction;
  isZammadDown: FlagFunction;
  isRatelimitingDisabled: FlagFunction;
  getAllFlags: () => Flags;
};

export type Flags = {
  bundesIdentDisabled?: boolean;
  bundesIdentDown?: boolean;
  ekonaDown?: boolean;
  ericaDown?: boolean;
  grundsteuerDown?: boolean;
  sendinblueDown?: boolean;
  zammadDown?: boolean;
  ratelimitingDisabled?: boolean;
};

export type Service =
  | "bundesident"
  | "ekona"
  | "erica"
  | "grundsteuer"
  | "sendinblue"
  | "zammad"
  | "ratelimiting";

const isServiceDown = (service: Service | undefined) => {
  if (service === undefined) return false;
  return unleash.isEnabled("grundsteuer." + service + "_down") || false;
};

const isBundesIdentDisabled = () => {
  return unleash.isEnabled("grundsteuer.bundesident_disabled") || false;
};

const isBundesIdentDown = () => {
  return isServiceDown("bundesident");
};

const isEkonaDown = () => {
  return isServiceDown("ekona");
};

const isEricaDown = () => {
  return isServiceDown("erica");
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

const isRatelimitingDisabled = () => {
  return unleash.isEnabled("grundsteuer.ratelimiting_disabled") || false;
};

const getAllFlags = () => {
  return {
    bundesIdentDisabled: isBundesIdentDisabled(),
    bundesIdentDown: isBundesIdentDown(),
    ekonaDown: isEkonaDown(),
    ericaDown: isEricaDown(),
    grundsteuerDown: isGrundsteuerDown(),
    sendinblueDown: isSendinblueDown(),
    zammadDown: isZammadDown(),
    ratelimitingDisabled: isRatelimitingDisabled(),
  };
};

export const flags: FlagFunctions = {
  isBundesIdentDisabled,
  isBundesIdentDown,
  isEkonaDown,
  isEricaDown,
  isGrundsteuerDown,
  isSendinblueDown,
  isZammadDown,
  isRatelimitingDisabled,
  getAllFlags,
};
