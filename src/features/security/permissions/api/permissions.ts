import api from "@/lib/config/axios";
import { API_URL } from "@/lib/const/environments";
import { apiResponseSchema } from "@/shared/schemas/api/apiResponse.schema";
import { apiSchemaError } from "@/shared/utils/apiSchemaError";
import { apiAxiosError } from "@/shared/utils/networkError";
import { PermissionsArraySchema } from "../schema/permissions";

export const fetchPermissions = async () => {
  try {
    const { data } = await api(`${API_URL}/permissions`);

    // Validate the backend response schema
    const result = apiResponseSchema(PermissionsArraySchema).safeParse(data);

    if (!result.success) {
      return await apiSchemaError(result);
    }
    return {
      type: "success",
      data: result.data.data,
      message: result.data.message,
      statusCode: result.data.statusCode,
    };
  } catch (error) {
    return await apiAxiosError(error);
  }
};
