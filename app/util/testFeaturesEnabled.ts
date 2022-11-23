export const testFeaturesEnabled = (email?: string): boolean => {
  if (process.env.TEST_FEATURES_ENABLED === "true") return true;
  if (email) return /@digitalservice.bund.de/.test(email);
  return false;
};
