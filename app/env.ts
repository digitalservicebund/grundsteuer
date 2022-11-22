import { z } from "zod";

const toBoolean = (v: string | undefined) => {
  return !(typeof v === "undefined" || ["0", "false"].includes(v));
};

const schema = z.object({
  APP_ENV: z.enum(["local", "gha", "staging", "production"]),
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
  APP_VERSION: z.string().min(1),
  APP_MODE: z.literal("cron").optional(),

  BASE_URL: z.string().url(),
  ERICA_URL: z.string().url(),
  DATABASE_URL: z.string().url().startsWith("postgresql://"),
  REDIS_URL: z.string().url().startsWith("redis://"),

  MAGIC_LINK_SECRET: z.string().min(1),
  SESSION_COOKIE_SECRET: z.string().min(1),
  FORM_COOKIE_SECRET: z.string().min(1),
  FORM_COOKIE_ENC_SECRET: z.string().length(32),

  AUDIT_PUBLIC_KEY: z.string().min(1),

  HASHED_LOGGING_SALT: z.string().min(1),
  HASHED_IP_LIMIT_SALT: z.string().min(1),

  UNLEASH_HOST: z.string().url(),
  UNLEASH_API_TOKEN: z.string().min(1),
  UNLEASH_REFRESH_INTERVAL: z
    .string()
    .default("15000")
    .transform((v) => Number(v)),

  SENTRY_DSN: z
    .string()
    .regex(/^https:\/\/.+@.+\.ingest\.sentry\.io\/\d+/)
    .optional(),

  SENDINBLUE_API_KEY: z.string().optional(),

  USEID_DOMAIN: z.string().url(),
  USEID_API_KEY: z.string().min(1),

  EKONA_ISSUER: z.string().min(1),
  EKONA_ISSUER_URL: z.string().url(),
  EKONA_ENC_KEY: z.string().min(1),
  EKONA_SIGNING_KEY: z.string().min(1),
  EKONA_ENTRY_POINT: z.string().min(1),
  EKONA_IDP_CERT: z.string().min(1),

  TEST_FEATURES_ENABLED: z.string().optional().transform(toBoolean),
  SKIP_AUTH: z.string().optional().transform(toBoolean),
  SKIP_RATELIMIT: z.string().optional().transform(toBoolean),
});

export default schema.parse(process.env);
