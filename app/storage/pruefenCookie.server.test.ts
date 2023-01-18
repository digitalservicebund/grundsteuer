import { getMachine } from "~/routes/__infoLayout/pruefen/_step";
import {
  getFromPruefenStateCookie,
  saveToPruefenStateCookie,
} from "./pruefenCookie.server";

describe("saveToPruefenStateCookie / getFromPruefenStateCookie", () => {
  it("encodes/decodes correctly", async () => {
    const state = getMachine({ formData: {} }).getInitialState("bundesland");
    const encodedCookie = await saveToPruefenStateCookie(state);
    const decodedCookie = await getFromPruefenStateCookie(encodedCookie);
    expect(decodedCookie.value).toEqual(state.value);
    expect(decodedCookie.context).toEqual(state.context);
  });
});
