import * as XLSX from "xlsx";

export const downloadExcelTemplate = ({
  columns,
  fileName = "asset-register-template",
  sheetName = "Asset Register",
}) => {
  if (!columns?.length) {
    throw new Error("No columns available for template.");
  }

  // Only include columns configured for the Excel template
  const templateColumns = columns.filter(
    (column) => column.includeInTemplate !== false
  );

  if (!templateColumns.length) {
    throw new Error("No columns available for the template.");
  }

  // Create an empty row using Excel field names
  const templateRow = {};

  templateColumns.forEach((column) => {
    templateRow[column.excelField || column.field] = "";
  });

  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet([templateRow]);

  // Set column widths
  worksheet["!cols"] = templateColumns.map((column) => ({
    wch: Math.max(
      (column.excelField || column.field).length + 4,
      15
    ),
  }));

  // Create workbook
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    sheetName
  );

  // Download
  XLSX.writeFile(
    workbook,
    `${fileName}.xlsx`
  );
};