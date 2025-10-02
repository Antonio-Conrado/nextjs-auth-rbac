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
  resetPasswordErrors,
  resetPasswordSchema,
} from "../schemas/resetPasswordSchema";

export async function resetPasswordAction(
  state: InitialState<resetPasswordErrors, null>,
  formData: FormData
): Promise<InitialState<resetPasswordErrors, null>> {
  const t = await getTranslations();
  const schema = resetPasswordSchema(t);

  // Validate form fields
  const validateFields = schema.safeParse({
    resetPasswordToken: formData.get("resetPasswordToken"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!validateFields.success) {
    const errorTree = z.treeifyError(validateFields.error);
    return {
      errors: {
        resetPasswordToken: errorTree.properties?.resetPasswordToken?.errors,
        email: errorTree.properties?.email?.errors,
        password: errorTree.properties?.password?.errors,
        passwordConfirm: errorTree.properties?.passwordConfirm?.errors,
      },
    };
  }

  try {
    const resp = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resetPasswordToken: validateFields.data.resetPasswordToken,
        email: validateFields.data.email,
        password: validateFields.data.password,
        passwordConfirm: validateFields.data.passwordConfirm,
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
