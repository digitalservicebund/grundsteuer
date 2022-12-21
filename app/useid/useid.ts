import invariant from "tiny-invariant";
import { DataGroup, Place, UseIdAPI } from "useid-eservice-sdk";

let useidAPIConnection: UseIdAPI;

const getUseidApi = () => {
  if (!useidAPIConnection) {
    invariant(process.env.USEID_API_KEY, "USEID_API_KEY is not set.");
    invariant(process.env.USEID_DOMAIN, "USEID_DOMAIN is not set.");
    useidAPIConnection = new UseIdAPI(
      process.env.USEID_API_KEY,
      process.env.USEID_DOMAIN
    );
  }
  return useidAPIConnection;
};

const getWidgetSrc = () => {
  const widgetSrc = getUseidApi().widgetSrc;
  invariant(widgetSrc, "Expected to receive a widgetSrc from useid");
  return widgetSrc;
};

const getTcTokenUrl = async () => {
  const useidResponse = await getUseidApi().startSession();
  invariant(
    useidResponse.tcTokenUrl,
    "Expected to receive a tcTokenUrl from useid"
  );
  return useidResponse.tcTokenUrl;
};

const hashTcTokenUrl = async (tcTokenUrl: string) => {
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(tcTokenUrl)
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
};

// Only exporting for testing purposes. Use getIdentityData instead.
export const getIdentity = async (sessionId: string) => {
  return getUseidApi().getIdentity(sessionId);
};

const getIdentityData = async (sessionId: string) => {
  const identity = await getIdentity(sessionId);
  const address = (identity.get(DataGroup.PlaceOfResidence) as Place)
    ?.structuredPlace;
  const extractedData = {
    firstName: identity.get(DataGroup.GivenNames) as string | undefined,
    lastName: identity.get(DataGroup.FamilyNames) as string | undefined,
    street: address?.street,
    postalCode: address?.zipCode,
    city: address?.city,
    country: address?.country,
  };
  return checkDataForAttributes(extractedData);
};

const checkDataForAttributes = (
  extracedData: Partial<BundesIdentIdentifiedData>
) => {
  invariant(
    extracedData.firstName,
    "Validated BundesIdent data did not contain firstName"
  );
  invariant(
    extracedData.lastName,
    "Validated BundesIdent data did not contain lastName"
  );
  invariant(
    extracedData.street,
    "Validated BundesIdent data did not contain street"
  );
  invariant(
    extracedData.postalCode,
    "Validated BundesIdent data did not contain postalCode"
  );
  invariant(
    extracedData.city,
    "Validated BundesIdent data did not contain city"
  );
  invariant(
    extracedData.country,
    "Validated BundesIdent data did not contain country"
  );
  return extracedData as BundesIdentIdentifiedData;
};

export type BundesIdentIdentifiedData = {
  firstName: string;
  lastName: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
};

export const useid = {
  getWidgetSrc,
  getTcTokenUrl,
  getIdentityData,
  hashTcTokenUrl,
};
