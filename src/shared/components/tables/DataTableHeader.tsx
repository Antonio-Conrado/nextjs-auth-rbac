import { TableHead, TableHeader, TableRow } from "../ui/table";

type Props = {
  columns: string[];
};
export default function DataTableHeader({ columns }: Props) {
  return (
    <TableHeader>
      <TableRow className="hover:bg-zinc-800 bg-zinc-800">
        {columns.map((column, index) => (
          <TableHead key={index} className="text-white text-center capitalize">
            {column}
          </TableHead>
        ))}
      </TableRow>
    </TableHeader>
  );
}
