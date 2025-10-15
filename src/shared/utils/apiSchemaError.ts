import z from "zod";
import { apiResponse } from "../schemas/api/apiResponse.schema";
import { LOCALE } from "@/lib/const/environments";

// Build an error object when the response does not match the ApiResponseSchema
export async function apiSchemaError<T>(
  result?: z.ZodSafeParseResult<T>
): Promise<apiResponse<null>> {
  let issueMessage = "";
  if (result && !result.success) {
    issueMessage = result.error.issues[0].message;
  }
  const message =
    LOCALE === "en"
      ? `The server response could not be validated. The data does not match the expected schema. Validation issue at: ${issueMessage}`
      : `La validación de la respuesta del servidor falló. Los datos no coinciden con el esquema esperado. Error en: ${issueMessage}`;

  return {
    type: "error",
    message: message,
    data: null,
    statusCode: 500,
  };
}
