export const useSecureCookie = ["staging", "production"].includes(
  process.env.APP_ENV as string
);
