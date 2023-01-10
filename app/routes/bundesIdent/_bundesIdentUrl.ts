import { isMobileUserAgent } from "~/util/isMobileUserAgent";

export const getBundesIdentUrl = (request: Request): string => {
  const isMobile = isMobileUserAgent(request);
  return "/bundesIdent/" + (isMobile ? "voraussetzung" : "desktop");
};
