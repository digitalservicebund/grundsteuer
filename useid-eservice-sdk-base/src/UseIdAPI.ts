import { IStartSessionResponse } from "./IStartSessionResponse";
import { Identity } from "./Identity";
import axios from "axios";

export class UseIdAPI {
  public domain: string;
  public widgetSrc: string;
  public apiBaseUrl: string;

  constructor(apiKey: string, domain: string) {
    axios.interceptors.request.use((config) => {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${apiKey}`;
      return config;
    });
    this.domain = domain;
    this.widgetSrc = `${domain}/widget.js`;
    this.apiBaseUrl = `${domain}/api/v1/identification/sessions`;
  }

  async startSession(): Promise<IStartSessionResponse> {
    const response = await axios.post(this.apiBaseUrl);
    return {
      tcTokenUrl: response.data.tcTokenUrl,
    };
  }

  async getIdentity(eIdSessionId: string): Promise<Identity> {
    const response = await axios.get(`${this.apiBaseUrl}/${eIdSessionId}`);
    return new Identity(response.data);
  }
}

export interface IUseIdAPI {
  startSession(): Promise<IStartSessionResponse>;
  getIdentity(eIdSessionId: string): Promise<Identity>;
}
