import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import env from "~/env";

type SystemStatus = { env: string };

export const loader: LoaderFunction = async () => {
  return { env: env.APP_ENV };
};

export default function Health() {
  const status = useLoaderData<SystemStatus>();
  return (
    <div className="text-center bg-beige-100 h-full p-4">
      <h1 className="text-xl">System Status</h1>
      <p>
        Env: <span className="font-bold">{status.env}</span>
      </p>
    </div>
  );
}
