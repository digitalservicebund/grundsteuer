import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { pageTitle } from "~/util/pageTitle";
import { ErrorPage } from "~/components";

export const loader: LoaderFunction = () => {
  // creating this catch-all route and letting it throw an 404
  // is a workaround for:
  // https://github.com/sergiodxa/remix-i18next/issues/33
  throw new Response("Page missing", { status: 404 });
};

export const meta: MetaFunction = () => {
  return { title: pageTitle("Seite konnte nicht gefunden werden") };
};

export default function CatchAllRoute() {
  return null;
}

export function CatchBoundary() {
  return <ErrorPage statusCode={404} />;
}
