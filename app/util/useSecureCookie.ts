import env from "~/env";

export const useSecureCookie = ["staging", "production"].includes(env.APP_ENV);
