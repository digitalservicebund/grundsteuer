import env from "~/env";

export const testFeaturesEnabled = (email?: string) => {
  if (env.TEST_FEATURES_ENABLED) return true;
  if (email) return /@digitalservice.bund.de/.test(email);
  return false;
};
