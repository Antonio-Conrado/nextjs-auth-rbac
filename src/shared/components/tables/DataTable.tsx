import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/shared/components/ui/table";
import { meta } from "@/shared/schemas/pagination";
import DataTablesPagination from "./DataTablesPagination";
import DataTableHeader from "./DataTableHeader";
import { useTranslations } from "next-intl";

type Props<T extends { id: string | number }> = {
  data: T[];
  meta: meta;
  columns: string[];
  onPageChange: (page: number) => void;
  renderRow: (item: T) => React.ReactNode;
};

export function DataTable<T extends { id: string | number }>({
  data,
  meta,
  columns,
  onPageChange,
  renderRow,
}: Props<T>) {
  const t = useTranslations("ui");
  return (
    <>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <DataTableHeader columns={columns} />
          <TableBody>
            {data.length ? (
              data.map((item, index) => (
                <TableRow key={item.id ?? index}>{renderRow(item)}</TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2}>{t("noResults")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablesPagination meta={meta} onPageChange={onPageChange} />
    </>
  );
}
