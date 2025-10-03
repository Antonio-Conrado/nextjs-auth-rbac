"use server";
import * as z from "zod";
import {
  apiResponseSchema,
  InitialState,
} from "@/shared/schemas/api/apiResponse.schema";
import {
  changePasswordErrors,
  changePasswordSchema,
} from "../schemas/changePassword";
import { apiAxiosError } from "@/shared/utils/networkError";
import { API_URL } from "@/lib/const/environments";
import api from "@/lib/config/axios";
import { apiSchemaError } from "@/shared/utils/apiSchemaError";

export async function changePasswordAction(
  initialState: InitialState<changePasswordErrors, null>,
  formData: FormData
): Promise<InitialState<changePasswordErrors, null>> {
  const schema = await changePasswordSchema();

  const validateFields = schema.safeParse({
    id: formData.get("id"),
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    passwordConfirm: formData.get("passwordConfirm"),
  });

  if (!validateFields.success) {
    const errorTree = z.treeifyError(validateFields.error);
    return {
      errors: {
        currentPassword: errorTree.properties?.currentPassword?.errors,
        newPassword: errorTree.properties?.newPassword?.errors,
        passwordConfirm: errorTree.properties?.passwordConfirm?.errors,
      },
    };
  }

  try {
    const { id, currentPassword, newPassword, passwordConfirm } =
      validateFields.data;
    const { data } = await api.patch(`${API_URL}/users/${id}/change-password`, {
      currentPassword,
      newPassword,
      passwordConfirm,
    });

    const result = apiResponseSchema(z.null()).safeParse(data);
    if (!result.success) {
      return await apiSchemaError(result);
    }
    return {
      message: result.data.message,
      type: "success",
    };
  } catch (error) {
    return await apiAxiosError(error);
  }
}
