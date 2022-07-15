import { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  // TODO handle Ekona reponse
  const body = await request.formData();
  return body.get("SAMLResponse") as string;
};
