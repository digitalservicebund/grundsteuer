import invariant from "tiny-invariant";
import env from "~/env";

export type ValidatedEkonaData = {
  issuer: string;
  IdNr: string;
  Vorname?: string;
  Name: string;
  Anschrift: {
    Strasse: { _: string }[];
    Hausnummer: { _: string }[];
    PLZ?: { _: string }[];
    Ort: { _: string }[];
    Land: { _: string }[];
    Adressergaenzung?: { _: string }[];
  };
};

export const checkIssuer = (validatedData: Partial<ValidatedEkonaData>) => {
  invariant(
    validatedData.issuer == env.EKONA_ISSUER_URL,
    "Validated ekona data needs to have correct issued"
  );
};

export const extractIdentData = (validatedData: any) => {
  checkDataForAttributes(validatedData);
  return {
    idnr: validatedData.IdNr,
    firstName: validatedData.Vorname,
    lastName: validatedData.Name,
    street: validatedData.Anschrift.Strasse[0]._,
    housenumber: validatedData.Anschrift.Hausnummer[0]._,
    postalCode: validatedData.Anschrift.PLZ
      ? validatedData.Anschrift.PLZ[0]._
      : undefined,
    addressSupplement: validatedData.Anschrift.Adressergaenzung
      ? validatedData.Anschrift.Adressergaenzung[0]._
      : undefined,
    city: validatedData.Anschrift.Ort[0]._,
    country: validatedData.Anschrift.Land[0]._,
  };
};

const checkDataForAttributes = (validatedData: Partial<ValidatedEkonaData>) => {
  invariant(validatedData.IdNr, "Validated ekona data did not contain IdNr");
  invariant(validatedData.Name, "Validated ekona data did not contain Name");
  invariant(
    validatedData.Anschrift?.Strasse &&
      validatedData.Anschrift?.Strasse.length >= 1,
    "Validated ekona data did not contain Strasse"
  );
  invariant(
    validatedData.Anschrift?.Hausnummer &&
      validatedData.Anschrift?.Hausnummer.length >= 1,
    "Validated ekona data did not contain Hausnummer"
  );
  invariant(
    validatedData.Anschrift?.Ort && validatedData.Anschrift?.Ort.length >= 1,
    "Validated ekona data did not contain Ort"
  );
  invariant(
    validatedData.Anschrift?.Land && validatedData.Anschrift?.Land.length >= 1,
    "Validated ekona data did not contain Land"
  );
};
