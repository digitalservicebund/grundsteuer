import invariant from "tiny-invariant";

type ericaRequestDto = {
  clientIdentifier: string;
  payload: object;
};

const postToErica = async (endpoint: string, dataToSend: object) => {
  invariant(
    process.env.ERICA_URL !== undefined,
    "environment variable ERICA_URL is not set"
  );

  invariant(
    process.env.ERICA_CLIENT_IDENTIFIER !== undefined,
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

type ericaResponseDto = {
  processStatus: "Processing" | "Success" | "Failure";
  result: object | null;
  errorCode: string | null;
  errorMessage: string | null;
};

const getFromErica = async (endpoint: string) => {
  invariant(
    process.env.ERICA_URL !== undefined,
    "environment variable ERICA_URL is not set"
  );

  const response = await fetch(`${process.env.ERICA_URL}/${endpoint}`);

  if (response.status == 200) {
    const ericaResponse: ericaResponseDto = await response.json();
    return ericaResponse;
  }
};

export type { ericaResponseDto };
export { postToErica, getFromErica };
