import invariant from "tiny-invariant";
import { jobs } from "./app/cron.server";

invariant(process.env.DATABASE_URL, "DATABASE_URL is not set.");
invariant(process.env.AUDIT_PUBLIC_KEY, "AUDIT_PUBLIC_KEY is not set.");
invariant(process.env.REDIS_URL, "REDIS_URL is not set.");
invariant(process.env.ERICA_URL, "ERICA_URL is not set.");
// run once every hour
jobs.scheduleFscCleanup("0 * * * *");
jobs.schedulePdfCleanup("30 * * * *");
jobs.scheduleTransferticketCleanup("31 * * * *");
// run once every day
jobs.scheduleAccountCleanup("0 8 * * *");
// run every minute
jobs.scheduleUpdateEricaRequest("* * * * *");
