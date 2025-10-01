"use client";
import { refreshTokenAction } from "@/features/auth/actions/login-actions";
import { getUserProfile } from "@/features/auth/api/auth";
import { accessToken } from "@/features/auth/schemas/loginSchemas";
import { ACCESS_TOKEN_EXPIRES_IN_MS } from "@/lib/const/environments";
import { apiResponse } from "@/shared/schemas/api/apiResponse.schema";
import { useAppStore } from "@/store/useStore";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect } from "react";
import { toast } from "sonner";

type Props = {
  children: ReactNode;
  accessToken: string | null;
  tokenKey: "refreshToken" | "rememberToken" | null;
};

// Global lock to prevent multiple concurrent refresh requests
let refreshingToken: Promise<apiResponse<accessToken>> | null = null;

export function AuthProvider({ children, accessToken, tokenKey }: Props) {
  const router = useRouter();
  const t = useTranslations("auth");
  const setUser = useAppStore((state) => state.setUser);

  /**
   * Refresh token function with lock mechanism.
   * Ensures that only one refresh request is active at a time.
   * All other requests that need a valid token will wait for this promise to resolve.
   */
  const refreshAccessToken =
    useCallback(async (): Promise<apiResponse<accessToken> | null> => {
      if (refreshingToken) return refreshingToken; // wait if refresh is already running
      if (!tokenKey) return null; // no refresh token available

      refreshingToken = (async () => {
        const result = await refreshTokenAction(tokenKey);
        refreshingToken = null; // release the lock
        return result;
      })();

      return refreshingToken; // return ongoing refresh promise
    }, [tokenKey]);

  // Fetch user profile if an access token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (accessToken) {
        const result = await getUserProfile();
        if (result.type === "success") {
          setUser(result.data!);
        } else {
          router.push("/login");
          toast.warning(t("sessionInvalid"));
        }
      }
    };
    fetchUser();
  }, [accessToken, router, setUser, t]);

  //Handles access token expiration and refresh.
  useEffect(() => {
    // If no access token and no refresh mechanism, redirect to login
    if (!accessToken && !tokenKey) {
      router.push("/login");
      return;
    }

    // If there is no access token but we do have a refresh/remember token → try to generate a new access token
    if (!accessToken && tokenKey) {
      const refresh = async () => {
        const result = await refreshAccessToken();
        if (result && result.type === "error") {
          router.push("/login");
          toast.warning(t("sessionRenewFailed"));
        } else {
          router.refresh();
        }
      };
      refresh();
      return;
    }

    // If an access token exists → schedule a refresh 20 seconds before expiration
    if (accessToken) {
      const timeout = setTimeout(async () => {
        if (tokenKey) {
          const result = await refreshAccessToken();
          if (result && result.type === "error") {
            router.push("/login");
            toast.warning(t("sessionExpired"));
          }
        } else {
          router.push("/login");
          toast.warning(t("sessionExpired"));
        }
      }, ACCESS_TOKEN_EXPIRES_IN_MS - 20000);

      return () => clearTimeout(timeout);
    }
  }, [accessToken, tokenKey, router, t, refreshAccessToken]);

  return <>{children}</>;
}
