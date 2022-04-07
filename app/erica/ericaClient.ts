import invariant from "tiny-invariant";

type ericaRequestDto = {
  clientIdentifier: string;
  payload: object;
};

const postToErica = async (endpoint: string, dataToSend: object) => {
  invariant(
    typeof process.env.ERICA_URL === "string",
    "environment variable ERICA_URL is not set"
  );

  invariant(
    typeof process.env.ERICA_CLIENT_IDENTIFIER === "string",
    "environment variable ERICA_CLIENT_IDENTIFIER is not set"
  );

  const ericaRequestData: ericaRequestDto = {
    clientIdentifier: process.env.ERICA_CLIENT_IDENTIFIER,
    payload: dataToSend,
  };

  const response = await fetch(`process.env.ERICA_URL/${endpoint}`, {
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

export { postToErica };
