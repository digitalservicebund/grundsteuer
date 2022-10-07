import { DataGroup } from "./DataGroup";

export interface IIdentityValues {
  personalData: IPersonalData;
}

export interface IPersonalData {
  [key: string]: string | undefined;
}

export class Identity {
  constructor(private data: IIdentityValues) {}

  get(dataGroup: DataGroup): Object | undefined {
    return this.data.personalData[dataGroup];
  }
}
