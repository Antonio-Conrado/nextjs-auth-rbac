"use client";
import { ValidateResetTokenPassword } from "@/features/auth/components/ValidateResetTokenPassword";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { ResetPasswordForm } from "@/features/auth/components/ResetPasswordForm";
import { useTranslations } from "next-intl";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email");
  const t = useTranslations();
  const [isValidToken, setIsValidToken] = useState(false);
  const [resetPasswordToken, setResetPasswordToken] = useState<string>("");

  useEffect(() => {
    if (!email) {
      toast.error(t("auth.resetPassword.emailNotProvided"));
      router.push("/login");
    }
  }, [email, router, t]);
  if (!email) return null;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {!isValidToken ? (
          <ValidateResetTokenPassword
            email={email}
            setIsValidToken={setIsValidToken}
            setResetPasswordToken={setResetPasswordToken}
          />
        ) : (
          <ResetPasswordForm
            email={email}
            resetPasswordToken={resetPasswordToken}
          />
        )}
      </div>
    </div>
  );
}
