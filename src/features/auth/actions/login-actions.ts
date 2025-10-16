"use server";
import * as z from "zod";
import {
  apiResponse,
  apiResponseSchema,
  InitialState,
} from "@/shared/schemas/api/apiResponse.schema";
import {
  accessToken,
  accessTokenSchema,
  LoginErrors,
  loginResponse,
  loginResponseSchema,
  loginSchema,
} from "../schemas/loginSchemas";
import { cookies } from "next/headers";
import { CookiesValues, getTokens } from "@/lib/const/cookies";
import { apiNetworkError, formNetworkError } from "@/shared/utils/networkError";
import {
  ACCESS_TOKEN_EXPIRES_IN_SEC,
  API_URL,
  IS_PRODUCTION,
  REFRESH_TOKEN_EXPIRES_IN_SEC,
  REMEMBER_ME_TOKEN_EXPIRES_IN_SEC,
} from "@/lib/const/environments";
import { keyToken } from "../schemas/profileSchema";
import { apiSchemaError } from "@/shared/utils/apiSchemaError";

export async function loginAction(
  state: InitialState<LoginErrors, loginResponse>,
  formData: FormData
): Promise<InitialState<LoginErrors, loginResponse>> {
  const cookieStore = await cookies();
  const schema = await loginSchema();

  // Validate form fields
  const validateFields = schema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    remember_me: formData.get("remember_me"),
  });

  if (!validateFields.success) {
    const errorTree = z.treeifyError(validateFields.error);
    return {
      errors: {
        email: errorTree.properties?.email?.errors,
        password: errorTree.properties?.password?.errors,
      },
    };
  }

  try {
    const resp = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: validateFields.data.email,
        password: validateFields.data.password,
        remember_me: validateFields.data.remember_me,
      }),
      credentials: "include",
    });

    // Validate form fields
    const result = apiResponseSchema(loginResponseSchema).safeParse(
      await resp.json()
    );

    if (!result.success) {
      return await apiSchemaError(result);
    }

    // Handle authentication error
    if (result.data.type === "error") {
      return {
        message: result.data.message,
        result: result.data.data,
        type: "error",
      };
    }
    // On successful authentication, save the obtained tokens in cookies
    if (result.data.type === "success" && result.data.data) {
      cookieStore.set(CookiesValues.accessToken, result.data.data.accessToken, {
        secure: IS_PRODUCTION,
        httpOnly: false,
        maxAge: ACCESS_TOKEN_EXPIRES_IN_SEC,
      });
      cookieStore.set(
        CookiesValues.refreshToken,
        result.data.data.refreshToken,
        {
          secure: IS_PRODUCTION,
          httpOnly: true,
          maxAge: REFRESH_TOKEN_EXPIRES_IN_SEC,
        }
      );
      cookieStore.set(
        CookiesValues.rememberToken,
        result.data.data.rememberToken ?? "",
        {
          secure: IS_PRODUCTION,
          httpOnly: true,
          maxAge: REMEMBER_ME_TOKEN_EXPIRES_IN_SEC,
        }
      );
    }

    // Return success message
    return {
      message: result.data.message,
      result: null,
      type: "success",
    };
  } catch {
    return await formNetworkError();
  }
}

export async function refreshTokenAction(
  key: keyToken
): Promise<apiResponse<accessToken | null>> {
  const cookieStore = await cookies();
  const { refreshToken, rememberToken } = await getTokens();

  const token = key === "refreshToken" ? { refreshToken } : { rememberToken };
  const path = key === "refreshToken" ? "refresh-token" : "remember-token";

  try {
    const resp = await fetch(`${API_URL}/auth/${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...token }),
      credentials: "include", // Include cookies in the request so the server can read and update them
    });

    const result = apiResponseSchema(accessTokenSchema).safeParse(
      await resp.json()
    );

    if (!result.success) {
      return await apiSchemaError(result);
    }

    if (result.data.data) {
      cookieStore.set(CookiesValues.accessToken, result.data.data.accessToken, {
        secure: IS_PRODUCTION,
        httpOnly: false,
        maxAge: ACCESS_TOKEN_EXPIRES_IN_SEC,
      });
    }

    return {
      data: result.data.data,
    };
  } catch {
    return await apiNetworkError();
  }
}
