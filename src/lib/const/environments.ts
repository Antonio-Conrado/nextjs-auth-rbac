import ms, { StringValue } from "ms";
export const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
export const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const LOCALE = process.env.NEXT_PUBLIC_DEFAULT_LOCALE ?? "es";
export const IS_PRODUCTION = process.env.NODE_ENV === "production";

// Token expirations in seconds
export const ACCESS_TOKEN_EXPIRES_IN_SEC = Math.floor(
  ms((process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue) || "10m") / 1000
);
export const REFRESH_TOKEN_EXPIRES_IN_SEC = Math.floor(
  ms((process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue) || "5d") / 1000
);
export const REMEMBER_ME_TOKEN_EXPIRES_IN_SEC = Math.floor(
  ms((process.env.REMEMBER_ME_TOKEN_EXPIRES_IN as StringValue) || "15d") / 1000
);

//token expirations in miliseconds
export const ACCESS_TOKEN_EXPIRES_IN_MS = ms(
  (process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue) || "10m"
);
