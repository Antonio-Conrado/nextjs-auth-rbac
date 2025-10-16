import { meta } from "@/shared/schemas/pagination";
import { Button } from "../ui/button";
import { useTranslations } from "next-intl";

type Props = {
  meta: meta;
  onPageChange: (page: number) => void;
};

export default function DataTablesPagination({ meta, onPageChange }: Props) {
  const t = useTranslations("ui");
  const start = (meta.page - 1) * meta.limit + 1;
  const end = Math.min(meta.page * meta.limit, meta.total);

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="text-muted-foreground flex-1 text-sm">
        {start} -{end} {""}
        {t("tables.of")} {meta.total} {""}
        {t("tables.rows")}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page - 1)}
          disabled={!meta.hasPreviousPage}
        >
          {t("tables.previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(meta.page + 1)}
          disabled={!meta.hasNextPage}
        >
          {t("tables.next")}
        </Button>
      </div>
    </div>
  );
}
