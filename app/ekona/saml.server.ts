import { SAML, SamlConfig } from "@node-saml/node-saml/lib";
import { Session } from "@remix-run/node";
import { SessionCacheProvider } from "~/ekona/SessionCacheProvider";
import { ValidateInResponseTo } from "@node-saml/node-saml/lib/types";
import env from "~/env";

function getSamlConfig(session: Session) {
  const samlOptions: SamlConfig = {
    issuer: env.EKONA_ISSUER,
    cert: env.EKONA_IDP_CERT,
    protocol: "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST",
    callbackUrl: env.BASE_URL + "/ekona/callback",
    entryPoint: env.EKONA_ENTRY_POINT,
    signatureAlgorithm: "sha256",
    digestAlgorithm: "sha256",
    signMetadata: true,
    decryptionPvk: env.EKONA_ENC_KEY,
    privateKey: env.EKONA_SIGNING_KEY,
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
