import invariant from "tiny-invariant";
import { EricaResponse } from "~/erica/utils";

type ericaRequestDto = {
  clientIdentifier: string;
  payload: object;
};

const ericaClientIdentifier = "grundsteuer";

type PostToEricaResponse = { location: string } | { error: string };

export const postToErica = async (
  endpoint: string,
  dataToSend: object
): Promise<PostToEricaResponse> => {
  invariant(
    typeof process.env.ERICA_URL !== "undefined",
    "environment variable ERICA_URL is not set"
  );

  const ericaRequestData: ericaRequestDto = {
    clientIdentifier: ericaClientIdentifier,
    payload: dataToSend,
  };

  const url = `${process.env.ERICA_URL}/${endpoint}`;
  console.log(`Making erica request to ${url}`);
  const response = await fetch(url, {
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
    const location = response.headers.get("location");
    invariant(location, `Request to ${url} did not return an ericaRequestId`);
    console.log(`Request to ${url} succeeded with location ${location}`);
    return { location };
  } else if (response.status == 201) {
    throw Error("Erica responded without location parameter");
  } else if (response.status == 422) {
    return { error: "EricaWrongFormat" };
  } else {
    throw Error(`Erica responded with ${response.status}`);
  }
};

export const getFromErica = async (endpoint: string) => {
  invariant(
    process.env.ERICA_URL !== undefined,
    "environment variable ERICA_URL is not set"
  );

  const url = `${process.env.ERICA_URL}/${endpoint}`;
  const response = await fetch(url);

  if (response.status == 200) {
    const ericaResponse: EricaResponse = await response.json();
    return ericaResponse;
  } else if (response.status == 404) {
    console.log(`Erica request not found for ${url}`);
    return {
      errorType: "EricaRequestNotFound",
      errorMessage: "Could not find request",
    };
  } else {
    console.error(
      `Error in getFromErica: status ${response.status} for ${url}`
    );
  }
};
