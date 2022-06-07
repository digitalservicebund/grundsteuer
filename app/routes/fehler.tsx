import { LoaderFunction } from "@remix-run/node";

// route for development only:
// for testing error handling
export const loader: LoaderFunction = async () => {
  throw new Error("Fehler!!!");
};

export default function Fehler() {
  return null;
}
