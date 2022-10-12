import { json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { pageTitle } from "~/util/pageTitle";
import { useId } from "~/useid/useid";
import { useLoaderData } from "@remix-run/react";
import {
  BreadcrumbNavigation,
  Button,
  ContentContainer,
  Headline,
} from "~/components";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifizieren Sie sich mit Ihrem Ausweis") };
};

export const loader: LoaderFunction = async ({ request }) => {
  if (process.env.USE_USE_ID !== "true") {
    throw new Response("Not Found", {
      status: 404,
    });
  }
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  if (user.identified) {
    return redirect("/formular");
  }

  return json(
    {
      widgetSrc: useId.getWidgetSrc(),
      tcTokenUrl: await useId.getTcTokenUrl(),
      useIdDomain: process.env.USEID_DOMAIN,
    },
    {}
  );
};

export default function BundesidIndex() {
  const { tcTokenUrl, useIdDomain } = useLoaderData();
  return (
    <>
      <ContentContainer size="sm" className="mb-80">
        <BreadcrumbNavigation />
        <Headline>
          Identifizieren Sie sich mit Ihrem Ausweis und der BundesIdent App
        </Headline>
      </ContentContainer>

      <ContentContainer size="lg">
        <iframe
          src={`${useIdDomain}/widget?hostname=localhost#tcTokenURL=${encodeURIComponent(
            tcTokenUrl
          )}`}
          style={{ width: "100%", minHeight: "600px" }}
        />
        <Button look={"secondary"}>Zurück zu den Voraussetzungen</Button>
      </ContentContainer>
    </>
  );
}
