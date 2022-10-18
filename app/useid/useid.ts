import invariant from "tiny-invariant";
import { DataGroup, Place, UseIdAPI } from "useid-eservice-sdk";

let useIdAPIConnection: UseIdAPI;

const getUseIdApi = () => {
  if (!useIdAPIConnection) {
    invariant(process.env.USEID_API_KEY, "USEID_API_KEY is not set.");
    invariant(process.env.USEID_DOMAIN, "USEID_DOMAIN is not set.");
    useIdAPIConnection = new UseIdAPI(
      process.env.USEID_API_KEY as string,
      process.env.USEID_DOMAIN as string
    );
  }
  return useIdAPIConnection;
};

const getDomain = () => {
  return getUseIdApi().domain;
};

const getWidgetSrc = () => {
  return getUseIdApi().widgetSrc;
};

const getTcTokenUrl = async () => {
  const useIdResponse = await getUseIdApi().startSession();
  return useIdResponse.tcTokenUrl;
};

// Only exporting for testing purposes. Use getIdentityData instead.
export const getIdentity = async (sessionId: string) => {
  return await getUseIdApi().getIdentity(sessionId);
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

export const useId = {
  getUseIdApi,
  getDomain,
  getWidgetSrc,
  getTcTokenUrl,
  getIdentityData,
};
