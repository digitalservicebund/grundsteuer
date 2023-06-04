import { SAML, SamlConfig } from "@node-saml/node-saml/lib";
import { Session } from "@remix-run/node";
import { SessionCacheProvider } from "~/ekona/SessionCacheProvider";
import { ValidateInResponseTo } from "@node-saml/node-saml/lib/types";

function getSamlConfig(session: Session) {
  const samlOptions: SamlConfig = {
    issuer: process.env.EKONA_ISSUER as string,
    cert: process.env.EKONA_IDP_CERT as string,
    protocol: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
    callbackUrl: process.env.BASE_URL + "/ekona/callback",
    entryPoint: process.env.EKONA_ENTRY_POINT,
    signatureAlgorithm: "sha256",
    digestAlgorithm: "sha256",
    signMetadata: true,
    decryptionPvk: process.env.EKONA_ENC_KEY,
    privateKey: process.env.EKONA_SIGNING_KEY,
    forceAuthn: true,
    wantAssertionsSigned: false,
    skipRequestCompression: true,
    identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
    cacheProvider: new SessionCacheProvider(session),
    validateInResponseTo: ValidateInResponseTo.always,
  };
  return samlOptions;
}

export const createSamlRequest = async (session: Session) => {
  const samlOptions = getSamlConfig(session);
  const saml = new SAML(samlOptions);
  return saml.getAuthorizeFormAsync("", samlOptions.entryPoint);
};

export const validateSamlResponse = async (
  response: string,
  session: Session
) => {
  const samlOptions = getSamlConfig(session);
  const saml = new SAML(samlOptions);
  return saml.validatePostResponseAsync({ SAMLResponse: response });
};
