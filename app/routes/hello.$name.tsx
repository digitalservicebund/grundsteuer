import { LoaderFunction, redirect } from "@remix-run/node";
import { printHello } from "~/jobs";

export const loader: LoaderFunction = async ({ params }) => {
  const { name, id } = await printHello({ name: params.name as string });
  return redirect(`/job/status/${name}/${id}`);
};
