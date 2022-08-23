import { ActionFunction } from "@remix-run/node";
import { action as stepAction } from "~/routes/formular/_step";
import { testFeaturesEnabled } from "~/util/testFeaturesEnabled";

export { loader, meta, Step as default } from "~/routes/formular/_step";

export const action: ActionFunction = async (args) => {
  if (!testFeaturesEnabled) {
    return stepAction(args);
  }

  const { request } = args;

  const formData = Object.fromEntries(await request.clone().formData());

  const modifiedFormData = new FormData();
  modifiedFormData.append("csrf", formData.csrf);

  const splitBy = /[/\\|]/; // allow /, \ and |

  if (["1/2", "1/3", "1/4"].includes(formData.zaehlerNenner as string)) {
    modifiedFormData.append(
      "zaehler",
      (formData.zaehlerNenner as string).split(splitBy)[0]
    );
    modifiedFormData.append(
      "nenner",
      (formData.zaehlerNenner as string).split(splitBy)[1]
    );
  } else {
    const splitted = (formData.userInput as string).split(splitBy);
    if (splitted.length === 2) {
      modifiedFormData.append("zaehler", splitted[0]);
      modifiedFormData.append("nenner", splitted[1]);
    } else {
      return {
        errors: {
          userInput:
            "Bitte tragen Sie den Eigentumsanteil mit einem Schrägstrich als Trennung ein.",
        },
      };
    }
  }

  // replace original formData with our modified version
  request.formData = async () => modifiedFormData;

  return stepAction(args);
};
