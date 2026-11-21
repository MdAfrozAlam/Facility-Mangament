import * as XLSX from "xlsx";

const normalizeHeader = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const formatExcelDate = (value) => {
  if (!value) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString().split("T")[0];
  }

  if (typeof value === "number") {
    const date = XLSX.SSF.parse_date_code(value);

    if (!date) {
      return "";
    }

    return `${date.y}-${String(date.m).padStart(2, "0")}-${String(
      date.d
    ).padStart(2, "0")}`;
  }

  return String(value).trim();
};

export const validateAssetRegisterExcel = async ({
  file,
  columns,
  existingAssets = [],
}) => {
  if (!file) {
    throw new Error("Please select an Excel file.");
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
    throw new Error("The Excel file does not contain any records.");
  }

  const excelHeaders = Object.keys(rows[0]);

  // --------------------------------
  // Columns expected in Excel
  // --------------------------------

  const templateColumns = columns.filter(
    (column) => column.includeInTemplate !== false
  );

  // --------------------------------
  // Validate required Excel columns
  // --------------------------------

  const requiredColumns = templateColumns.filter(
    (column) => column.required
  );

  const missingColumns = requiredColumns
    .filter(
      (column) =>
        !excelHeaders.some(
          (header) =>
            normalizeHeader(header) ===
            normalizeHeader(column.excelField)
        )
    )
    .map((column) => column.excelField);

  if (missingColumns.length > 0) {
    throw new Error(
      `Missing required columns: ${missingColumns.join(", ")}`
    );
  }

  // --------------------------------
  // Map Excel headers to React fields
  // --------------------------------

  const headerMap = {};

  templateColumns.forEach((column) => {
    const matchingHeader = excelHeaders.find(
      (header) =>
        normalizeHeader(header) ===
        normalizeHeader(column.excelField)
    );

    if (matchingHeader) {
      headerMap[column.field] = matchingHeader;
    }
  });

  // --------------------------------
  // Existing Asset IDs
  // --------------------------------

  const existingIds = new Set(
    existingAssets.map((asset) =>
      String(asset.id).trim().toLowerCase()
    )
  );

  const uploadedIds = new Set();

  // --------------------------------
  // Validate rows
  // --------------------------------

  const validRows = [];
  const invalidRows = [];

  rows.forEach((row, index) => {
    const excelRowNumber = index + 2;

    const result = {};
    const errors = [];

    templateColumns.forEach((column) => {
      const excelHeader = headerMap[column.field];

      let value = excelHeader
        ? row[excelHeader]
        : "";

      // Date conversion
      if (column.field === "purchaseDate") {
        value = formatExcelDate(value);
      } else if (
        value !== undefined &&
        value !== null
      ) {
        value = String(value).trim();
      }

      result[column.field] = value;

      // Required field validation
      if (
        column.required &&
        (value === "" ||
          value === null ||
          value === undefined)
      ) {
        errors.push(
          `${column.excelField} is required`
        );
      }
    });

    // --------------------------------
    // Duplicate Asset ID validation
    // --------------------------------
    // Asset ID is currently excluded from
    // the template, so this validation is
    // intentionally disabled.

    const assetId = String(result.id ?? "")
      .trim()
      .toLowerCase();

    // if (assetId) {
    //   if (existingIds.has(assetId)) {
    //     errors.push("Asset ID already exists");
    //   }

    //   if (uploadedIds.has(assetId)) {
    //     errors.push(
    //       "Duplicate Asset ID in uploaded file"
    //     );
    //   }

    //   uploadedIds.add(assetId);
    // }

    // --------------------------------
    // Store validation result
    // --------------------------------

    if (errors.length > 0) {
      invalidRows.push({
        rowNumber: excelRowNumber,
        data: result,
        errors,
      });
    } else {
      validRows.push(result);
    }
  });

  return {
    totalRecords: rows.length,
    validRecords: validRows.length,
    invalidRecords: invalidRows.length,
    validRows,
    invalidRows,
  };
};