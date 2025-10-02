"use server";
import * as z from "zod";
import {
  apiResponseSchema,
  InitialState,
} from "@/shared/schemas/api/apiResponse.schema";
import { formNetworkError } from "@/shared/utils/networkError";
import { API_URL } from "@/lib/const/environments";
import { apiSchemaError } from "@/shared/utils/apiSchemaError";
import { getTranslations } from "next-intl/server";
import {
  forgotPasswordErrors,
  forgotPasswordFormSchema,
} from "../schemas/forgotPassworsSchema";

export async function forgotPasswordAction(
  state: InitialState<forgotPasswordErrors, null>,
  formData: FormData
): Promise<InitialState<forgotPasswordErrors, null>> {
  const t = await getTranslations();
  const schema = forgotPasswordFormSchema(t);

  // Validate form fields
  const validateFields = schema.safeParse({
    email: formData.get("email"),
  });

  if (!validateFields.success) {
    const errorTree = z.treeifyError(validateFields.error);
    return {
      errors: {
        email: errorTree.properties?.email?.errors,
      },
    };
  }
  try {
    const resp = await fetch(`${API_URL}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: validateFields.data.email,
      }),
    });

    // Validate form fields
    const result = apiResponseSchema(z.null()).safeParse(await resp.json());
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
