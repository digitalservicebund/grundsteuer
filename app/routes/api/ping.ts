import { json, LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = ({ context }) => {
  const online = context.online;
  if (online) {
    return json({ status: "up" }, 200);
  }
  return json({ status: "shutting down" }, 503);
};
