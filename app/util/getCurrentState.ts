import { PREFIX as PRUEFEN_PREFIX } from "~/routes/pruefen/_step";
import { PREFIX as FORMULAR_PREFIX } from "~/routes/formular/_step";

export const getCurrentStateFromUrl = (url: string) => {
  return getCurrentStateFromPathname(new URL(url).pathname);
};

export const getCurrentStateFromPathname = (pathname: string) => {
  return pathname
    .split("/")
    .filter((e) => e && e !== FORMULAR_PREFIX && e !== PRUEFEN_PREFIX)
    .join(".");
};

export const getCurrentStateWithoutId = (currentState: string) => {
  return currentState.replace(/\.\d+\./g, ".");
};
