import { json, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = () => {
  return json({ status: "up" }, 200);
};
