import invariant from "tiny-invariant";

export type ValidatedEkonaData = {
  IdNr: string;
  Vorname: string;
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
export const extractIdentData = (validatedData: ValidatedEkonaData) => {
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
  invariant(
    validatedData.Vorname,
    "Validated ekona data did not contain Vorname"
  );
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
