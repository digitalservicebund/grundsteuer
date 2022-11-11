import { json, LoaderFunction } from "@remix-run/node";

// route for development only:
// for testing error handling
export const loader: LoaderFunction = async ({ params }) => {
  const code = params["*"];

  if (code) {
    throw json(null, { status: Number(code) });
  }

  throw new Error("Fehler!!!");
};

export default function Fehler() {
  return null;
}
