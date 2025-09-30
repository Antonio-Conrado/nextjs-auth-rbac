import axios from "axios";
import { API_URL } from "@/shared/const/environments";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  if (typeof window === "undefined") {
    // Server-side: use HttpOnly cookies
    const { cookies } = await import("next/headers");
    const token = (await cookies()).get("accessToken")?.value;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } else {
    // Client-side: use localStorage / Zustand or read non-HttpOnly cookie
    const token = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`accessToken=`))
      ?.split("=")[1];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default api;
