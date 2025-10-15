import { AlertCircleIcon } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "./card";
import { useTranslations } from "next-intl";

type Props = {
  message?: string | string[] | undefined;
};

export default function ErrorAlert({ message }: Props) {
  const t = useTranslations("ui");
  return (
    <Card>
      <CardHeader className="flex items-center gap-2 text-red-500">
        <AlertCircleIcon className="h-5 w-5" />
        <CardTitle className="text-red-500 dark:text-red-400">Error</CardTitle>
      </CardHeader>

      <CardDescription className="text-red-500 dark:text-red-400 font-medium pl-7">
        {t("noData")}
        {message && <p className="text-gray-700 dark:text-white">{message}</p>}
      </CardDescription>
    </Card>
  );
}
