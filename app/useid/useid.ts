import { UseIdAPI } from "useid-eservice-sdk";
import invariant from "tiny-invariant";

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

const getIdentityData = async (sessionId: string) => {
  await getUseIdApi().getIdentity(sessionId);
};

export const useId = {
  getUseIdApi,
  getDomain,
  getWidgetSrc,
  getTcTokenUrl,
  getIdentityData,
};
