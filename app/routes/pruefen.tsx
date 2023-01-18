import { LoaderFunction, redirect } from "@remix-run/node";
import { PRUEFEN_START_PATH } from "~/routes/__infoLayout/pruefen/_pruefenPath.server";

export const loader: LoaderFunction = async () => {
  return redirect(PRUEFEN_START_PATH);
};
