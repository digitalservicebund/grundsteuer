import { ActionFunction, redirect } from "@remix-run/node";
import _ from "lodash";
import {
  createHeadersWithFormDataCookie,
  getStoredFormData,
} from "~/formDataStorage.server";
import { authenticator } from "~/auth.server";
import { verifyCsrfToken } from "~/util/csrf";
import { action as stepAction, PREFIX } from "~/routes/formular/_step";
import invariant from "tiny-invariant";
import { Flurstueck, Person } from "~/domain/steps";

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

  let section: string | null = null;
  if (request.url.match(/grundstueck\/anzahl/)) {
    section = "grundstueck";
  } else if (request.url.match(/eigentuemer\/anzahl/)) {
    section = "eigentuemer";
  }
  invariant(
    section,
    "Dear developer, currently the code only works for /grundstueck/anzahl and /eigentuemer/anzahl."
  );

  const items = { grundstueck: "flurstueck", eigentuemer: "person" }[section];
  const maxAnzahl = {
    grundstueck: GRUNDSTUECK_ANZAHL_MAX,
    eigentuemer: EIGENTUEMER_ANZAHL_MAX,
  }[section];

  const storedAnzahl =
    Number(
      storedFormData[section as "grundstueck" | "eigentuemer"]?.anzahl?.anzahl
    ) || 1;

  let newAnzahl = 1;
  if (formData.deleteButton) {
    // decrease, but not smaller than 1
    newAnzahl = Math.max(1, storedAnzahl - 1);
  } else if (formData.increaseButton) {
    // increase, but not larger than <maxAnzahl>
    newAnzahl = Math.min(maxAnzahl as number, storedAnzahl + 1);
  }

  let formDataToBeStored = _.set(
    _.cloneDeep(storedFormData),
    `${section}.anzahl.anzahl`,
    newAnzahl.toString()
  );

  if (formData.deleteButton) {
    let listOfItems: Flurstueck[] | Person[] | undefined;
    if (section === "grundstueck") {
      listOfItems = storedFormData.grundstueck?.flurstueck;
    } else if (section === "eigentuemer") {
      listOfItems = storedFormData.eigentuemer?.person;
    }

    if (listOfItems) {
      const deleteButtonValue = formData.deleteButton as string; // eg. 1/3
      const idToBeDeleted = deleteButtonValue.split("/")[0];
      const anzahlWhenDeleteRequestWasIssued = deleteButtonValue.split("/")[1];
      const indexToBeDeleted = Number(idToBeDeleted as string) - 1;
      // We don't have IDs, only indices.
      // Imagine having the page open in 2 browser tabs it could easily happen
      // that a delete request for one item is sent twice. With indices alone it
      // might happen that 2 items are deleted (not good).
      // As a (incomplete) mitigation we also send the total number of items.
      // E.g. 2/5 (delete 2nd item of 5 items total)
      // Sending this request ("2/5") twice allows us to ignore the second request
      // as we can detect that the total number has changed.
      if (Number(anzahlWhenDeleteRequestWasIssued as string) === storedAnzahl) {
        listOfItems.splice(indexToBeDeleted, 1); // splice works in-place; mutates the list!
      }
    }

    formDataToBeStored = _.set(
      _.cloneDeep(formDataToBeStored),
      `${section}.${items}`,
      listOfItems
    );
  }

  const headers = await createHeadersWithFormDataCookie({
    data: formDataToBeStored,
    user,
  });

  return redirect(`/${PREFIX}/${section}/anzahl`, { headers });
};
