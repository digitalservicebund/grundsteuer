import { RootLoaderData } from "~/root";
import { useMatches } from "@remix-run/react";

export const useRootLoaderData = (): RootLoaderData => {
  const matches = useMatches();
  const data = matches.find((match) => match.id === "root")?.data;
  return data as RootLoaderData;
};
