"use server";

import api from "@/lib/config/axios";
import {
  apiResponse,
  apiResponseSchema,
} from "@/shared/schemas/api/apiResponse.schema";
import { UserProfile, userProfileSchema } from "../schemas/profileSchema";
import { API_URL } from "@/lib/const/environments";

export async function fetchUserProfileAction(): Promise<
  apiResponse<UserProfile>
> {
  try {
    const { data } = await api(`${API_URL}/auth/profile`);
    const result = apiResponseSchema(userProfileSchema).safeParse(data);


// const resp = await fetch(`${API_URL}/auth/profile`);

//     const result = apiResponseSchema(userProfileSchema).safeParse(await resp.json());


    console.log({ result});
    // console.log({ result: result.data });
    if (!result.success) {
      return {
        data: result.data,
      };
    }
    return {
      type:"success",
      data: result.data.data,
    };
  } catch {
    return {
      message: "error de servidor",
    };
    // return
  }
}
