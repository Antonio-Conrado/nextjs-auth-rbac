import api from "@/lib/config/axios";
import { API_URL } from "@/lib/const/environments";
import { apiAxiosError } from "@/shared/utils/networkError";
import {
  apiResponse,
  apiResponseSchema,
} from "@/shared/schemas/api/apiResponse.schema";
import { apiSchemaError } from "@/shared/utils/apiSchemaError";
import { paginationDataSchema } from "@/shared/schemas/pagination";
import z from "zod";
import { usersListProfileSchema } from "../schema/user";
import {
  UserProfile,
  userProfileSchema,
} from "@/features/auth/schemas/profileSchema";

type fethUsersProps = {
  page: number;
  limit: number;
  t: (key: string) => string;
};

export const fetchUsers = async ({ page, limit, t }: fethUsersProps) => {
  try {
    const skip = (page - 1) * limit;
    const { data } = await api(`${API_URL}/users?skip=${skip}&take=${limit}`);

    // Validate the backend response schema
    const userPaginationResponseSchema = apiResponseSchema(
      paginationDataSchema(usersListProfileSchema(t))
    );
    const result = userPaginationResponseSchema.safeParse(data);

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

export async function fetchUser(
  id: number
): Promise<apiResponse<UserProfile | null>> {
  try {
    const { data } = await api(`${API_URL}/users/${id}`);
    //Validate the backend response schema
    const result = apiResponseSchema(userProfileSchema).safeParse(data);

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
}

export const toogleStatusUser = async (id: number) => {
  try {
    const { data } = await api.patch(`${API_URL}/users/${id}/toggle-status`);

    // Validate the backend response schema
    const result = apiResponseSchema(z.null()).safeParse(data);

    if (!result.success) {
      return await apiSchemaError(result);
    }
    return {
      type: "success",
      data: null,
      message: result.data.message,
      statusCode: result.data.statusCode,
    };
  } catch (error) {
    return await apiAxiosError(error);
  }
};
