import { DataGroup } from "./DataGroup";

export interface IIdentityValues {
  personalData: IPersonalData;
}

export interface Place {
  structuredPlace?: {
    street?: string;
    zipCode?: string;
    city?: string;
    country?: string;
  };
}

export interface IPersonalData {
  [key: string]: Place | string | undefined;
}

export class Identity {
  constructor(private data: IIdentityValues) {}

  get(dataGroup: DataGroup): Place | string | undefined {
    return this.data.personalData[dataGroup];
  }
}
