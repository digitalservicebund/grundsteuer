import { LoaderFunction, useLoaderData } from "remix";

type LoaderData = { status: "up" | "down" };

const HOST = "http://localhost:3000";
export const loader: LoaderFunction = async () => {
  try {
    return await fetch(HOST + "/api/status").then((data) => data.json());
  } catch (e) {
    return { status: "down" };
  }
};

export default function Health() {
  const data = useLoaderData<LoaderData>();
  return (
    <div className="text-center bg-beige-100 h-full p-4">
      <h1 className="text-xl">System Status</h1>
      <p>
        Aktueller Status: <span className="font-bold">{data.status}</span>
      </p>
    </div>
  );
}
