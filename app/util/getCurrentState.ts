export const getCurrentStateFromUrl = (url: string) => {
  return getCurrentStateFromPathname(new URL(url).pathname);
};

export const getCurrentStateFromPathname = (pathname: string) => {
  return pathname
    .split("/")
    .filter((e) => e && e !== "formular" && e !== "pruefen")
    .join(".");
};

export const getCurrentStateWithoutId = (currentState: string) => {
  return currentState.replace(/\.\d+\./g, ".");
};
