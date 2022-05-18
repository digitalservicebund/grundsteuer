import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

type SystemStatus = { db: string; env: string };

export const loader: LoaderFunction = async ({ context }) => {
  const { clientIp, xForwardedFor, expressFunction, remoteAddr } = context;
  const dbStatus = await pingDb();

  console.log("X-Forwarded-For: " + xForwardedFor);
  console.log("x-real-ip: " + clientIp);
  console.log("Express function: " + expressFunction);
  console.log("remote adress: " + remoteAddr);

  return { db: dbStatus, env: process.env.APP_ENV };
};

export async function pingDb() {
  return "down";
}

export default function Health() {
  const status = useLoaderData<SystemStatus>();
  return (
    <div className="text-center bg-beige-100 h-full p-4">
      <h1 className="text-xl">System Status</h1>
      <p>
        Env: <span className="font-bold">{status.env}</span>
      </p>
      <p>
        Database: <span className="font-bold">{status.db}</span>
      </p>
    </div>
  );
}
