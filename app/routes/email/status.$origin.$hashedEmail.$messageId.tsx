import { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import invariant from "tiny-invariant";
import {
  BreadcrumbNavigation,
  EmailStatus,
  LoggedOutLayout,
} from "~/components";
import { getStatus, getUiStatus } from "~/email.server";
import { Feature, redis } from "~/redis.server";
import { pageTitle } from "~/util/pageTitle";

export const meta: MetaFunction = () => {
  return {
    title: pageTitle("Anmeldelink per E-Mail versendet"),
    robots: "noIndex",
  };
};

export const loader: LoaderFunction = async ({ params }) => {
  const { origin, hashedEmail, messageId } = params;

  invariant(
    typeof origin === "string",
    "Expected 'origin' to be included in params."
  );
  invariant(
    typeof hashedEmail === "string",
    "Expected 'hashedEmail' to be included in params."
  );
  invariant(
    typeof messageId === "string",
    "Expected 'messageId' to be included in params."
  );
  invariant(
    ["registrieren", "anmelden"].includes(origin),
    "Expected origin to be 'registrieren' or 'anmelden'."
  );

  const stringifiedData = await redis.get(Feature.MESSAGE_ID, hashedEmail);
  const email = stringifiedData && JSON.parse(stringifiedData)?.email;

  const status = await getStatus(messageId);
  const uiStatus = status
    ? getUiStatus(status.event, status.reason)
    : "request";

  return {
    hashedEmail,
    email: status?.email || email,
    messageId,
    origin,
    uiStatus,
    actionPath: `/${origin}`,
    actionLabel: {
      registrieren: "zurück zur Registrierung",
      anmelden: "zurück zur Anmeldung",
    }[origin],
  };
};

export default function AnmeldenEmail() {
  const loaderData = useLoaderData();
  const fetcher = useFetcher();

  const [fetchInProgress, setFetchInProgress] = useState(false);
  const [data, setData] = useState(loaderData);

  const {
    hashedEmail,
    email,
    uiStatus,
    messageId,
    origin,
    actionPath,
    actionLabel,
  } = data;

  useEffect(() => {
    if (fetcher.data) {
      setData(fetcher.data);
    }
  }, [fetcher.data]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!fetchInProgress && ["request", "deferred"].includes(uiStatus)) {
        setFetchInProgress(true);
        fetcher.load(`/email/status/${origin}/${hashedEmail}/${messageId}`);
        setFetchInProgress(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [fetcher]);

  return (
    <LoggedOutLayout>
      <BreadcrumbNavigation />
      <EmailStatus
        email={email}
        currentStatus={uiStatus}
        actionPath={actionPath}
        actionLabel={actionLabel}
      />
    </LoggedOutLayout>
  );
}
