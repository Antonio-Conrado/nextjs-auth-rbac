"use client";
import { toast } from "sonner";
import * as z from "zod";
import api from "@/lib/config/axios";
import { API_URL } from "@/lib/const/environments";
import { apiResponseSchema } from "@/shared/schemas/api/apiResponse.schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { apiAxiosError } from "@/shared/utils/networkError";
import { apiSchemaError } from "@/shared/utils/apiSchemaError";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const confirmationToken = searchParams.get("confirmationToken");

  const confirmAccount = useCallback(async () => {
    try {
      const { data } = await api.post(`${API_URL}/auth/confirm-account`, {
        email,
        confirmationToken,
      });
      // validate the response schema
      const result = apiResponseSchema(z.null()).safeParse(data);
      if (!result.success) {
        await apiSchemaError(result);
      }

      // if the response is successful, show a notification toast and redirect to login
      if (result.success && result.data.type === "success") {
        toast.success(result.data.message);
        router.push("/login");
      }
    } catch (error) {
      // if the response is successful, show a notification toast and redirect to login
      const result = await apiAxiosError(error);
      toast.error(result.message);
      router.push("/login");
    }
  }, [confirmationToken, email, router]);

  useEffect(() => {
    if (!email || !confirmationToken) {
      toast.error(t("auth.confirmAccount.missingConfirmationParams"));
      router.push("/login");
    } else {
      confirmAccount();
    }
  }, [email, confirmationToken, router, confirmAccount, t]);

  return <></>;
}
