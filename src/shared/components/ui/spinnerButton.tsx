import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { useTranslations } from "next-intl";

export function SpinnerButton() {
  const t = useTranslations("ui");
  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <Button
        disabled
        size="sm"
        className="flex items-center gap-2 pointer-events-auto"
      >
        <Spinner className="w-5 h-5" />
        {t("loading")}
      </Button>
    </div>
  );
}
