import { ConfigStepField } from "~/domain";

const anrede: ConfigStepField = {
  name: "anrede",
  validations: {},
};

const titel: ConfigStepField = {
  name: "titel",
  validations: {},
};

const name: ConfigStepField = {
  name: "name",
  validations: {},
};

const vorname: ConfigStepField = {
  name: "vorname",
  validations: {},
};

export const personNameFields = [anrede, titel, name, vorname];
