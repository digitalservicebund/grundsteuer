import { LoaderFunction, redirect } from "@remix-run/node";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";
import { PRUEFEN_START_PATH } from "~/routes/__infoLayout/pruefen/_pruefenPath.server";

export const loader: LoaderFunction = async () => {
  if (testFeaturesEnabled()) {
    return redirect(PRUEFEN_START_PATH);
  }
  return redirect("/pruefen/start");
};
