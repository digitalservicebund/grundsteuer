import { ActionFunction, redirect } from "@remix-run/node";
import _ from "lodash";
import {
  createHeadersWithFormDataCookie,
  getStoredFormData,
} from "~/formDataStorage.server";
import { authenticator } from "~/auth.server";
import { verifyCsrfToken } from "~/util/csrf";
import { action as stepAction, PREFIX } from "~/routes/formular/_step";

export const GRUNDSTUECK_ANZAHL_MAX = 20;
export const EIGENTUEMER_ANZAHL_MAX = 10;

export const action: ActionFunction = async (args) => {
  const { request } = args;

  // check if increase or delete buttons were used to submit form
  const formData = Object.fromEntries(await request.clone().formData());
  const increaseOrDeleteButtonsUsed =
    formData.increaseButton || formData.deleteButton;
  if (!increaseOrDeleteButtonsUsed) {
    // if not used, proceed with the regular step action
    return stepAction(args);
  }

  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  await verifyCsrfToken(request);

  const storedFormData = await getStoredFormData({ request, user });

  const section = request.url.match(/grundstueck\/anzahl/)
    ? "grundstueck"
    : "eigentuemer";
  const items = section === "grundstueck" ? "flurstueck" : "person";
  const maxAnzahl =
    section === "grundstueck" ? GRUNDSTUECK_ANZAHL_MAX : EIGENTUEMER_ANZAHL_MAX;

  const currentAnzahl =
    Number(
      storedFormData[section as "grundstueck" | "eigentuemer"]?.anzahl?.anzahl
    ) || 1;

  const newAnzahl = formData.deleteButton
    ? Math.max(1, currentAnzahl - 1)
    : Math.min(maxAnzahl, currentAnzahl + 1);

  let formDataToBeStored = _.set(
    _.cloneDeep(storedFormData),
    `${section}.anzahl.anzahl`,
    newAnzahl.toString()
  );

  if (formData.deleteButton) {
    const currentList =
      section === "grundstueck"
        ? storedFormData.grundstueck?.flurstueck
        : storedFormData.eigentuemer?.person;

    const newList = currentList;

    if (newList) {
      const index = Number((formData.deleteButton as string).split("/")[0]) - 1;
      // We don't have IDs, only indices.
      // Imagine having the page open in 2 browser tabs it could easily happen
      // that a delete request for one item is sent twice. With indices alone it
      // might happen that 2 items are deleted (not good).
      // As a (incomplete) mitigation we also send the total number of items.
      // E.g. 2/5 (delete 2nd item of 5 items total)
      // Sending this request ("2/5") twice allows us to ignore the second request
      // as we can detect that the total number has changed.
      const expectedCurrentAnzahl = Number(
        (formData.deleteButton as string).split("/")[1]
      );
      if (expectedCurrentAnzahl === currentAnzahl) {
        newList.splice(index, 1); // in-place!
      }
    }

    formDataToBeStored = _.set(
      _.cloneDeep(formDataToBeStored),
      `${section}.${items}`,
      newList
    );
  }

  const headers = await createHeadersWithFormDataCookie({
    data: formDataToBeStored,
    user,
  });

  return redirect(`/${PREFIX}/${section}/anzahl`, { headers });
};
