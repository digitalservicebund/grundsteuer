import crypto from "crypto";
import createDebugMessages from "debug";
import { Cookie, createCookie } from "@remix-run/node";
import invariant from "tiny-invariant";
import { GrundModel } from "~/domain/steps";
import { SessionUser } from "./auth.server";

const debug = createDebugMessages("formDataStorage");

type CreateFormDataCookieNameFunction = (options: {
  userId: string;
  index: number;
}) => string;

export const createFormDataCookieName: CreateFormDataCookieNameFunction = ({
  userId,
  index,
}) => {
  const cookieSuffix = crypto
    .createHash("sha256")
    .update(userId)
    .digest("hex")
    .slice(0, 32);
  return `form_data_${index}_${cookieSuffix}`;
};

type CreateFormDataCookieFunction = (options: {
  userId: string;
  index: number;
}) => Cookie;

export const createFormDataCookie: CreateFormDataCookieFunction = ({
  userId,
  index,
}) => {
  invariant(
    typeof process.env.FORM_COOKIE_SECRET === "string",
    "environment variable FORM_COOKIE_SECRET is not set"
  );
  const name = createFormDataCookieName({ userId, index });
  return createCookie(name, {
    path: "/",
    maxAge: 604_800 * 4, // 4 weeks
    httpOnly: true,
    sameSite: "strict",
    secure: !["local", "gha"].includes(process.env.APP_ENV as string),
    secrets: [process.env.FORM_COOKIE_SECRET],
  });
};

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

  const authoritiveCookie = await createFormDataCookie({
    userId: user.id,
    index: 0,
  }).parse(cookieHeader);
  debug({ authoritiveCookie });

  if (!authoritiveCookie) return {};

  const slicesCount = Number(authoritiveCookie[0]);

  const cookies = [authoritiveCookie.slice(1)];

  for (let index = 1; index < slicesCount; index++) {
    const cookie = await createFormDataCookie({ userId: user.id, index }).parse(
      cookieHeader
    );
    cookies.push(cookie);
  }
  debug({ cookies });

  const cookiesCombined = cookies.join("");
  try {
    const parsedContent = JSON.parse(cookiesCombined);
    if (parsedContent?.userId === user.id && parsedContent?.data) {
      return parsedContent.data;
    }
    return {};
  } catch (error) {
    return {};
  }
};

type AddFormDataCookiesToHeadersFunction = (options: {
  headers: Headers;
  data: GrundModel;
  user: SessionUser;
}) => Promise<void>;

export const addFormDataCookiesToHeaders: AddFormDataCookiesToHeadersFunction =
  async ({ headers, data, user }) => {
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

    const stringifiedAndCompressedData = JSON.stringify(cookieData);

    // Does the data fit into one cookie or do we have to slice it
    // and store it across serveral cookies?
    const slicesCount = Math.ceil(
      stringifiedAndCompressedData.length / CONTENT_LENGTH_PER_COOKIE
    );

    // Expect slicesCount to be 1-3, but just in case (later we assume it is one digit).
    if (slicesCount > 9) {
      throw new Error(
        "Storing data across more than 9 cookies is not supported."
      );
    }

    const slicedData = [];
    for (let index = 0; index < slicesCount; index++) {
      slicedData.push(
        stringifiedAndCompressedData.slice(
          index * CONTENT_LENGTH_PER_COOKIE,
          (index + 1) * CONTENT_LENGTH_PER_COOKIE
        )
      );
    }

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
        index === 0 ? `${slicesCount}${dataSlice}` : dataSlice
      );

      // When our assumptions are right, this should not happen.
      // But in case it should happen, we want to raise an error, as
      // otherwise this might fail silently (too large Set-Cookie
      // might just be ignored in the browser).
      if (cookieWithData.length > MAX_COOKIE_SIZE) {
        throw new Error("Cookie size limit exceeded.");
      }

      headers.append("Set-Cookie", cookieWithData);
    }
  };
