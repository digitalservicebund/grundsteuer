import { LoaderFunction, useLoaderData } from "remix";
import { db } from "../db/db.server";

type SystemStatus = { db: string };

export const loader: LoaderFunction = async () => {
  const dbStatus = await pingDb();
  return { db: dbStatus };
};

export async function pingDb() {
  try {
    await db.$queryRaw`SELECT 1 AS result`;
    return "up";
  } catch (e) {
    console.error(e);
    return "down";
  }
}

export default function Health() {
  const status = useLoaderData<SystemStatus>();
  return (
    <div className="text-center bg-beige-100 h-full p-4">
      <h1 className="text-xl">System Status</h1>
      <p>
        Database: <span className="font-bold">{status.db}</span>
      </p>
    </div>
  );
}
