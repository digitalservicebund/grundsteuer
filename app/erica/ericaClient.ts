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

  if (response.status == 201) {
    return response.headers.get("location");
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

export { postToErica, getFromErica };
