import * as XLSX from "xlsx";

/**
 * Convert Excel date values into YYYY-MM-DD
 */
export const formatExcelDate = (value) => {
  if (!value) return "";

  // Already a JavaScript Date
  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  // Excel serial date
  if (typeof value === "number") {
    const excelDate = XLSX.SSF.parse_date_code(value);

    if (!excelDate) {
      return "";
    }

    const year = excelDate.y;
    const month = String(excelDate.m).padStart(2, "0");
    const day = String(excelDate.d).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  // String date
  if (typeof value === "string") {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }

    return value;
  }

  return String(value);
};


/**
 * Import Excel file and convert it into application data
 */
export const importFromExcel = async ({
  file,
  columns,
  dateFields = [],
}) => {
  if (!file) {
    throw new Error("No Excel file selected.");
  }

  const data = await file.arrayBuffer();

  const workbook = XLSX.read(data, {
    type: "array",
    cellDates: true,
  });

  const sheetName = workbook.SheetNames[0];

  if (!sheetName) {
    throw new Error("No worksheet found in the Excel file.");
  }

  const worksheet = workbook.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
    raw: true,
  });

  if (!rows.length) {
    throw new Error("The Excel file is empty.");
  }

  // Excel headers
  const excelHeaders = Object.keys(rows[0]);

  // Check required columns
  const missingColumns = columns
    .filter((column) => column.required)
    .filter(
      (column) =>
        !excelHeaders.includes(column.headerName)
    );

  if (missingColumns.length > 0) {
    throw new Error(
      `Missing required columns: ${missingColumns
        .map((column) => column.headerName)
        .join(", ")}`
    );
  }

  // Convert Excel rows into application objects
  return rows.map((row, index) => {
    const result = {};

    columns.forEach((column) => {
      let value = row[column.headerName];

      if (dateFields.includes(column.field)) {
        value = formatExcelDate(value);
      }

      result[column.field] = value;
    });

    return result;
  });
};