/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  apiResponse,
  InitialState,
} from "@/shared/schemas/api/apiResponse.schema";
import { getTranslations } from "next-intl/server";

// Response for actions that work with forms (includes field errors, result, and message)
export async function formNetworkError(): Promise<InitialState<any, any>> {
  const t = await getTranslations("api");
  return {
    type: "error",
    message: t("serverError"),
    errors: null,
    result: null,
  };
}

// Response for generic API requests (does not include field errors, only data, statusCode, and type)
// Useful for endpoints like refresh token or other backend-only actions
export async function apiNetworkError(): Promise<apiResponse<any>> {
  const t = await getTranslations("api");
  return {
    type: "error",
    message: t("serverError"),
    statusCode: 500,
    data: null,
  };
}
