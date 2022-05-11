import { Factory } from "fishery";
import type { User } from "~/domain/user";

export const userFactory = Factory.define<User>(({ sequence }) => ({
  id: sequence.toString(),
  email: "user@example.com",
  password: "$2a$10$PucerjfpXwtjL1jBi7qlH.qtWHdyC0nPMgNgWm7ih3671OCCfaij2",
  identified: false,
  createdAt: new Date(),
  fscRequest: [],
  ericaRequestIdFscBeantragen: null,
  ericaRequestIdFscAktivieren: null,
  ericaRequestIdFscStornieren: null,
  ericaRequestIdSenden: null,
  transferticket: null,
  pdf: null,
}));
