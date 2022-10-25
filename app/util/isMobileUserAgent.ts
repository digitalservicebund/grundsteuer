import { deviceDetect } from "react-device-detect";

export const isMobileUserAgent = (request: Request) => {
  let isMobile = false;
  const userAgent = request.headers.get("User-Agent");
  if (userAgent) {
    isMobile = deviceDetect(userAgent).isMobile;
  }
  return isMobile;
};
