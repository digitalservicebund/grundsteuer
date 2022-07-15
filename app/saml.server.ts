import { SAML, SamlConfig } from "node-saml/lib";

export const createSamlRequest = async () => {
  const samlOptions: SamlConfig = {
    issuer: process.env.EKONA_ISSUER,
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
    wantAssertionsSigned: true,
    skipRequestCompression: true,
    identifierFormat: "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent",
  };

  const saml = new SAML(samlOptions);
  return saml.getAuthorizeFormAsync("", samlOptions.entryPoint);
};
