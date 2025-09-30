import { getTranslations } from "next-intl/server";
import * as z from "zod";

// Build an error object when the response does not match the ApiResponseSchema
export async function apiSchemaError<T>(result: z.ZodSafeParseResult<T>) {
  const t = await getTranslations("api");

  console.error(
    t("apiResponseSchemaError"),
    result.success ? null : result.error.issues
  );

  return {
    type: undefined,
  };
}
