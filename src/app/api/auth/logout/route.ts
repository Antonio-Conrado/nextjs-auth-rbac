import * as z from "zod";

import {
  apiResponse,
  apiResponseSchema,
} from "@/shared/schemas/api/apiResponse.schema";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiSchemaError } from "@/shared/utils/apiSchemaError";
import { apiNetworkError } from "@/shared/utils/networkError";
import { CookiesValues, getTokens } from "@/lib/const/cookies";
import { API_URL } from "@/lib/const/environments";

export async function POST(): Promise<NextResponse<apiResponse<null>>> {
  const cookieStore = await cookies();
  const { refreshToken, rememberToken } = await getTokens();

  const token = refreshToken ? refreshToken : rememberToken;
  const key = refreshToken ? "refreshToken" : "rememberToken";

  try {
    const resp = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key,
        token,
      }),
    });

    const result = apiResponseSchema(z.unknown()).safeParse(await resp.json());
    if (!result.success) {
      return NextResponse.json(await apiSchemaError(result));
    }

    cookieStore.delete(CookiesValues.accessToken);
    cookieStore.delete(CookiesValues.refreshToken);
    cookieStore.delete(CookiesValues.rememberToken);
    return NextResponse.json<apiResponse<null>>({
      data: null,
      statusCode: result.data.statusCode,
      message: result.data.message,
      type: "success",
    });
  } catch {
    return NextResponse.json(await apiNetworkError());
  }
}
