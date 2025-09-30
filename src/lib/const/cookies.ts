import { cookies } from "next/headers";
export const CookiesValues = {
  accessToken: "accessToken",
  refreshToken: "refreshToken",
  rememberToken: "rememberToken",
};

export async function getTokens() {
  const allCookies = await cookies();
  const accessToken = allCookies.get(CookiesValues.accessToken)?.value ?? null;
  const refreshToken =
    allCookies.get(CookiesValues.refreshToken)?.value ?? null;
  const rememberToken =
    allCookies.get(CookiesValues.rememberToken)?.value ?? null;

  return { accessToken, refreshToken, rememberToken };
}
