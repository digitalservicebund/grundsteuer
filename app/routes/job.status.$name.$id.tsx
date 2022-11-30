import { json, LoaderFunction } from "@remix-run/node";
import { getJob } from "~/queue.server";
import { jobStatus } from "~/services";

export const loader: LoaderFunction = async ({ params }) => {
  const { name, id } = params;
  const job = await getJob({ name: name as string, id: id as string });
  console.log(job);
  return json(jobStatus(job));
};
