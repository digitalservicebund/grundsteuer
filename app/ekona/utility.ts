import { CacheProvider } from "node-saml";
import { Session } from "@remix-run/node";
import invariant from "tiny-invariant";

export type validatedEkonaData = {
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
export const extractIdentData = (validatedData: validatedEkonaData) => {
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

export const checkDataForAttributes = (
  validatedData: Partial<validatedEkonaData>
) => {
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

export class SessionCacheProvider implements CacheProvider {
  session: Session;

  constructor(session: Session) {
    this.session = session;
  }

  // Store an item in the cache, using the specified key and value.
  async saveAsync(key: string, value: string) {
    this.session.set(key, value);
    return Object.assign({
      key: key,
      value: value,
      createdAt: new Date().getTime(),
    });
  }

  // Returns the value of the specified key in the cache
  async getAsync(key: string) {
    return this.session.get(key);
  }
  // Removes an item from the cache if the key exists
  async removeAsync(key: string) {
    const oldValue = this.session.get(key);
    this.session.unset(key);
    return oldValue;
  }
}
