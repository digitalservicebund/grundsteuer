import { json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { pageTitle } from "~/util/pageTitle";
import { useid } from "~/useid/useid";
import { useLoaderData } from "@remix-run/react";
import { Button, ButtonContainer, Headline, SectionLabel } from "~/components";
import Bolt from "~/components/icons/mui/Bolt";
import { useEffect, useState } from "react";
import EnableJsDisclaimer from "~/components/EnableJsDisclaimer";
import { applyRateLimit } from "~/redis/rateLimiting.server";
import RateLimitExceeded from "~/components/RateLimitExceeded";
import { Feature } from "~/redis/redis.server";
import { isMobileUserAgent } from "~/util/isMobileUserAgent";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifizieren Sie sich mit Ihrem Ausweis") };
};

const checkIfRateLimitExceeded = async (request: Request) => {
  if (!(await applyRateLimit(Feature.BUNDES_IDENT_RATE_LIMIT, 1))) {
    console.log(
      "BundesIdent rate limit exceeded at " + new Date().toISOString()
    );
    return { rateLimitExceeded: true, isMobile: isMobileUserAgent(request) };
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/anmelden",
  });
  if (user.identified) {
    return redirect("/formular");
  }

  const rateLimitExceeded = await checkIfRateLimitExceeded(request);
  if (rateLimitExceeded) return rateLimitExceeded;
  const isErrorState = new URL(request.url).searchParams.get("errorState");
  if (isErrorState) {
    console.log("Started new bundesIdent flow after error");
  } else {
    console.log("Started bundesIdent flow");
  }
  const tcTokenUrl = await useid.getTcTokenUrl();
  const hashedTcTokenUrl = await useid.hashTcTokenUrl(tcTokenUrl);

  return json(
    {
      host: new URL(request.url).hostname,
      widgetSrc: useid.getWidgetSrc(),
      tcTokenUrl: tcTokenUrl,
      hashedTcTokenUrl: hashedTcTokenUrl,
      useidDomain: process.env.USEID_DOMAIN,
    },
    {}
  );
};

export default function BundesIdentIndex() {
  const { tcTokenUrl, hashedTcTokenUrl, useidDomain, host, rateLimitExceeded } =
    useLoaderData();

  const [isJavaScriptEnabled, setIsJavaScriptEnabled] = useState(false);
  useEffect(() => {
    setIsJavaScriptEnabled(true);
  });

  if (!isJavaScriptEnabled) {
    return <EnableJsDisclaimer />;
  }

  if (rateLimitExceeded) {
    return <RateLimitExceeded service="BundesIdent" />;
  }

  return (
    <>
      <Headline>
        Identifizieren Sie sich mit Ihrem Ausweis und der BundesIdent App
      </Headline>

      <div className="h-[476px] pt-16">
        <iframe
          src={`${useidDomain}/widget?hostname=${host}&hash=${hashedTcTokenUrl}#tcTokenURL=${encodeURIComponent(
            tcTokenUrl
          )}`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
      <ButtonContainer className="mt-24">
        <Button look={"secondary"} to="/bundesIdent/voraussetzung">
          Zurück zur Voraussetzung
        </Button>
      </ButtonContainer>
    </>
  );
}
