"use server";

import {
  apiResponseSchema,
  InitialState,
} from "@/shared/schemas/api/apiResponse.schema";
import { profileErrors, profileSchema } from "../schemas/profile";
import { getTranslations } from "next-intl/server";
import z from "zod";
import { apiAxiosError } from "@/shared/utils/networkError";
import api from "@/lib/config/axios";
import { API_URL } from "@/lib/const/environments";
import { apiSchemaError } from "@/shared/utils/apiSchemaError";

export async function profileAction(
  userId: number | undefined,
  initialState: InitialState<profileErrors, null>,
  formData: FormData
): Promise<InitialState<profileErrors, null>> {
  const t = await getTranslations();
  const schema = profileSchema(t);

  // Ensure that userId exists and is a valid number before making the API request
  if (!userId || isNaN(userId)) {
    return {
      type: "error",
      message: t("validation.missingValue", { item: "id" }),
    };
  }

  // Validate form fields
  const validateFields = schema.safeParse({
    name: formData.get("name"),
    surname: formData.get("surname"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    roleId: Number(formData.get("roleId")),
  });

  if (!validateFields.success) {
    const errorTree = z.treeifyError(validateFields.error);
    return {
      errors: {
        name: errorTree.properties?.name?.errors,
        surname: errorTree.properties?.surname?.errors,
        telephone: errorTree.properties?.telephone?.errors,
        email: errorTree.properties?.email?.errors,
        roleId: errorTree.properties?.roleId?.errors,
      },
    };
  }

  try {
    const { name, surname, email, telephone } = validateFields.data;
    const { data } = await api.patch(`${API_URL}/users/${userId}`, {
      name,
      surname,
      telephone,
      email,
    });

    const result = apiResponseSchema(z.null()).safeParse(data);
    if (!result.success) {
      return await apiSchemaError(result);
    }
    return {
      message: result.data.message,
      result: null,
      type: "success",
    };
  } catch (error) {
    return await apiAxiosError(error);
  }
}
