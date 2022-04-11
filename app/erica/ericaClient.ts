import invariant from "tiny-invariant";
import { EricaResponse } from "~/erica/utils";

type ericaRequestDto = {
  clientIdentifier: string;
  payload: object;
};

export const postToErica = async (endpoint: string, dataToSend: object) => {
  invariant(
    typeof process.env.ERICA_URL !== "undefined",
    "environment variable ERICA_URL is not set"
  );

  invariant(
    typeof process.env.ERICA_CLIENT_IDENTIFIER !== "undefined",
    "environment variable ERICA_CLIENT_IDENTIFIER is not set"
  );

  const ericaRequestData: ericaRequestDto = {
    clientIdentifier: process.env.ERICA_CLIENT_IDENTIFIER,
    payload: dataToSend,
  };

  const response = await fetch(`${process.env.ERICA_URL}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(ericaRequestData),
  });

  if (
    response.status == 201 &&
    response.headers.get("location") &&
    response.headers.get("location") !== "null"
  ) {
    return response.headers.get("location");
  } else if (response.status == 201) {
    throw Error("Erica responded without location parameter");
  } else if (response.status == 422) {
    throw Error("Erica responded with error for wrong format");
  } else {
    throw Error(`Erica responded with ${response.status}`);
  }
};

export const getFromErica = async (endpoint: string) => {
  invariant(
    process.env.ERICA_URL !== undefined,
    "environment variable ERICA_URL is not set"
  );

  const response = await fetch(`${process.env.ERICA_URL}/${endpoint}`);

  if (response.status == 200) {
    const ericaResponse: EricaResponse = await response.json();
    return ericaResponse;
  }
};
