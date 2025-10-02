"use server";
import * as z from "zod";
import {
  apiResponseSchema,
  InitialState,
} from "@/shared/schemas/api/apiResponse.schema";
import { formNetworkError } from "@/shared/utils/networkError";
import { API_URL } from "@/lib/const/environments";
import { apiSchemaError } from "@/shared/utils/apiSchemaError";
import {
  registerErrors,
  registerFormDataSchema,
} from "../schemas/registerSchema";
import { getTranslations } from "next-intl/server";

export async function registerAction(
  state: InitialState<registerErrors, null>,
  formData: FormData
): Promise<InitialState<registerErrors, null>> {
  const t = await getTranslations();
  const schema = registerFormDataSchema(t);

  // Validate form fields
  const validateFields = schema.safeParse({
    name: formData.get("name"),
    surname: formData.get("surname"),
    telephone: formData.get("telephone"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    const errorTree = z.treeifyError(validateFields.error);
    return {
      errors: {
        name: errorTree.properties?.name?.errors,
        surname: errorTree.properties?.surname?.errors,
        telephone: errorTree.properties?.telephone?.errors,
        email: errorTree.properties?.email?.errors,
        password: errorTree.properties?.password?.errors,
      },
    };
  }

  try {
    const resp = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: validateFields.data.name,
        surname: validateFields.data.surname,
        telephone: validateFields.data.telephone,
        email: validateFields.data.email,
        password: validateFields.data.password,
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
