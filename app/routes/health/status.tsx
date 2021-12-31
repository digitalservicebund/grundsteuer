import { json, LoaderFunction } from "remix";

export const loader: LoaderFunction = () => {
  return json({ status: "up" }, 200);
};
