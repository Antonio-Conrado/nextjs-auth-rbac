import * as z from "zod";
import {
  apiResponse,
  apiResponseSchema,
} from "@/shared/schemas/api/apiResponse.schema";
import { UserProfile, userProfileSchema } from "../schemas/profileSchema";
import { apiAxiosError } from "@/shared/utils/networkError";
import { API_URL } from "@/lib/const/environments";
import { apiSchemaError } from "@/shared/utils/apiSchemaError";
import api from "@/lib/config/axios";
import axios from "axios";

export async function getUserProfile(): Promise<apiResponse<UserProfile>> {
  try {
    const { data } = await api(`${API_URL}/auth/profile`);
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

export async function logout(): Promise<apiResponse<null>> {
  try {
    // Call the Next.js API route for logout.
    // The server endpoint handles clearing cookies (refreshToken and rememberToken) safely.
    const { data } = await axios.post("api/auth/logout");
    const result = apiResponseSchema(z.null()).safeParse(data);

    console.log(result);
    if (!result.success) {
      return await apiSchemaError(result);
    }
    return {
      type: "success",
      message: result.data.message,
      statusCode: result.data.statusCode,
    };
  } catch (error) {
    return await apiAxiosError(error);
  }
}
