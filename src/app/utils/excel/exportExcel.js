import * as XLSX from "xlsx";

export const exportToExcel = ({
  data,
  columns,
  columnVisibilityModel = {},
  fileName = "export",
}) => {
  const visibleColumns = columns.filter(
    (column) =>
      columnVisibilityModel[column.field] !== false
  );

  const exportData = data.map((row) => {
    const exportRow = {};

    visibleColumns.forEach((column) => {
      exportRow[column.headerName] =
        row[column.field] ?? "";
    });

    return exportRow;
  });

  const worksheet =
    XLSX.utils.json_to_sheet(exportData);

  worksheet["!cols"] = visibleColumns.map(
    (column) => ({
      wch: Math.max(
        column.headerName.length + 3,
        15
      ),
    })
  );

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    "Data"
  );

  XLSX.writeFile(
    workbook,
    `${fileName}.xlsx`
  );
};