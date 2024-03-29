import createDebugMessages from "debug";
import { GrundModel } from "~/domain/steps/index.server";
import { SessionUser } from "~/auth.server";
import {
  COOKIE_ENCODING,
  createFormDataCookie,
  decryptCookie,
  encryptCookie,
} from "~/storage/cookies.server";
import { migrateData } from "~/storage/dataMigration.server";

const debug = createDebugMessages("formDataStorage");

enum DataCookieVersion {
  V1 = "v1",
}

type GetStoredFormDataFunction = (options: {
  request: Request;
  user: SessionUser;
}) => Promise<GrundModel>;

export const getStoredFormData: GetStoredFormDataFunction = async ({
  request,
  user,
}) => {
  const cookieHeader = request.headers.get("Cookie");
  debug({ cookieHeader });

  if (!cookieHeader) return {};
  const decodedData = await decodeFormDataCookie({ cookieHeader, user });

  return migrateData(decodedData);
};

export const decodeFormDataCookie = async ({
  cookieHeader,
  user,
}: {
  cookieHeader: string;
  user: SessionUser;
}) => {
  const authoritiveCookie = await createFormDataCookie({
    userId: user.id,
    index: 0,
  }).parse(cookieHeader);
  debug({ authoritiveCookie });

  if (!authoritiveCookie) return {};

  let slicesCount: number;
  let cookies: string[];

  if (authoritiveCookie.slice(0, 2) === DataCookieVersion.V1) {
    const splitCookie: string[] = authoritiveCookie.split(":");
    if (splitCookie.length !== 3) {
      console.error("Invalid cookie format.");
      return {};
    }
    slicesCount = Number(splitCookie[1]);
    cookies = [splitCookie[2]];
  } else {
    // legacy cookie; first character is slice count
    slicesCount = Number(authoritiveCookie[0]);
    cookies = [authoritiveCookie.slice(1)];
  }

  for (let index = 1; index < slicesCount; index++) {
    const cookie = await createFormDataCookie({ userId: user.id, index }).parse(
      cookieHeader
    );
    cookies.push(cookie);
  }
  debug({ cookies });

  const cookiesCombined = cookies.join("");
  try {
    const parsedContent = decryptCookie(
      Buffer.from(cookiesCombined, COOKIE_ENCODING)
    );
    if (parsedContent?.userId === user.id && parsedContent?.data) {
      return parsedContent.data;
    }
    return {};
  } catch (error) {
    console.error(error);
    return {};
  }
};

type CreateHeadersWithFormDataCookie = (options: {
  data: GrundModel;
  user: SessionUser;
}) => Promise<Headers | undefined>;

export const createHeadersWithFormDataCookie: CreateHeadersWithFormDataCookie =
  async ({ data, user }) => {
    const slices = await createSetCookieSlices(data, user);

    const headers = new Headers();
    slices.forEach((slice) => headers.append("Set-Cookie", slice));
    return headers;
  };

// Legacy mode is only used in testing for backward-compatibility. Do not use in production!
export async function createSetCookieSlices(
  data: GrundModel,
  user: SessionUser,
  legacy = false
): Promise<string[]> {
  // Size limit of one Set-Cookie header
  // (we can set several Set-Cookie headers in one request)
  const MAX_COOKIE_SIZE = 4096;

  // This assumes that there is up to 100% overhead through
  // encoding, encryption and metadata including cookie name
  // (2k actual cookie content => up to 4k cookie size)
  // 100% is conservative, in non-scientific experiments the
  // overhead was somewhere between 37% and 72% but depending
  // on the content also larger overheads seem possible
  const CONTENT_LENGTH_PER_COOKIE = MAX_COOKIE_SIZE / 2;

  // It's important to store the user id inside the encrypted content
  // (don't rely on the cookie name as this could be manipulated).
  const cookieData = {
    userId: user.id,
    data,
  };

  const encryptedCookie = encryptCookie(cookieData);

  // Does the data fit into one cookie or do we have to slice it
  // and store it across serveral cookies?
  const slicesCount = Math.ceil(
    encryptedCookie.length / CONTENT_LENGTH_PER_COOKIE
  );

  const slicedData = [];
  for (let index = 0; index < slicesCount; index++) {
    slicedData.push(
      encryptedCookie.slice(
        index * CONTENT_LENGTH_PER_COOKIE,
        (index + 1) * CONTENT_LENGTH_PER_COOKIE
      )
    );
  }

  const slices = [];
  for (let index = 0; index < slicedData.length; index++) {
    const dataSlice = slicedData[index];
    const cookie = createFormDataCookie({ userId: user.id, index });

    // The first (authoritive) cookie gets a "file signature".
    // The very first character of the content is a number and indicates
    // how many slices there are (it must be outside of the actual data,
    // as we need it before parsing the data).
    // It's important to write the slices count into the first cookie, as
    // this is the only cookie we can rely on (it's the only cookie which
    // is always (over)written). We don't delete cookies, so it's possible
    // to have stale cookies.
    const cookieWithData = await cookie.serialize(
      index === 0
        ? createAuthoritativeSlice(slicesCount, dataSlice, legacy)
        : dataSlice
    );

    // When our assumptions are right, this should not happen.
    // But in case it should happen, we want to raise an error, as
    // otherwise this might fail silently (too large Set-Cookie
    // might just be ignored in the browser).
    if (cookieWithData.length > MAX_COOKIE_SIZE) {
      throw new Error("Cookie size limit exceeded.");
    }

    slices.push(cookieWithData);
  }
  return slices;
}

function createAuthoritativeSlice(
  slicesCount: number,
  payload: string,
  legacy: boolean
) {
  if (legacy) return `${slicesCount}${payload}`;
  return `${DataCookieVersion.V1}:${slicesCount}:${payload}`;
}
