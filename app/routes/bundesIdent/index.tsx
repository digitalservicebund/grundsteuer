import { json, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { authenticator } from "~/auth.server";
import { pageTitle } from "~/util/pageTitle";
import { useid } from "~/useid/useid";
import { useLoaderData } from "@remix-run/react";
import { Button, ButtonContainer, Headline, SectionLabel } from "~/components";
import invariant from "tiny-invariant";
import Bolt from "~/components/icons/mui/Bolt";
import OnlyMobileDisclaimer from "~/components/OnlyMobileDisclaimer";
import { deviceDetect } from "react-device-detect";
import { useEffect, useState } from "react";
import EnableJsDisclaimer from "~/components/EnableJsDisclaimer";
import { applyRateLimit } from "~/redis/rateLimiting.server";
import RateLimitExceeded from "~/components/RateLimitExceeded";
import { Feature } from "~/redis/redis.server";

export const meta: MetaFunction = () => {
  return { title: pageTitle("Identifizieren Sie sich mit Ihrem Ausweis") };
};

export const isMobileUserAgent = (request: Request) => {
  let isMobile = false;
  const userAgent = request.headers.get("User-Agent");
  if (userAgent) {
    isMobile = deviceDetect(userAgent).isMobile;
  }
  return isMobile;
};

export const loader: LoaderFunction = async ({ request }) => {
  if (process.env.USE_USEID !== "true") {
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

  if (!(await applyRateLimit(Feature.BUNDES_IDENT_RATE_LIMIT))) {
    console.log(
      "BundesIdent rate limit exceeded at " + new Date().toISOString()
    );
    return { rateLimitExceeded: true, isMobile: isMobileUserAgent(request) };
  }

  const tcTokenUrl = await useid.getTcTokenUrl();
  invariant(tcTokenUrl, "Expected to receive a tcTokenUrl from useid");

  const isErrorState = new URL(request.url).searchParams.get("errorState");
  if (isErrorState) {
    console.log("Started new bundesIdent flow after error");
  } else {
    console.log("Started bundesIdent flow");
  }

  return json(
    {
      host: new URL(request.url).hostname,
      widgetSrc: useid.getWidgetSrc(),
      tcTokenUrl: await useid.getTcTokenUrl(),
      useidDomain: process.env.USEID_DOMAIN,
      isMobile: isMobileUserAgent(request),
    },
    {}
  );
};

export default function BundesIdentIndex() {
  const { tcTokenUrl, useidDomain, host, isMobile, rateLimitExceeded } =
    useLoaderData();
  if (!isMobile) {
    return <OnlyMobileDisclaimer />;
  }

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
      <SectionLabel
        icon={<Bolt className="mr-4" />}
        backgroundColor="yellow"
        className="mb-16"
      >
        Beta-Status
      </SectionLabel>
      <Headline>
        Identifizieren Sie sich mit Ihrem Ausweis und der BundesIdent App
      </Headline>

      <div className="h-[520px]">
        <iframe
          src={`${useidDomain}/widget?hostname=${host}#tcTokenURL=${encodeURIComponent(
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
