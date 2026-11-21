"use client";

import { Box, Button } from "@mui/material";
import {
  UploadFile,
  FileDownload,
  PictureAsPdf,
  Add,
  Download,
} from "@mui/icons-material";

import styles from "./DataTableActions.module.css";

export default function DataTableActions({
  showImport = false,
  showExportExcel = false,
  showExportPDF = false,
  showAdd = false,
  showBulkRegister = false,
  showDownloadTemplate = false,

  addLabel = "Add Register",

  onImport,
  onExportExcel,
  onExportPDF,
  onAdd,
  onBulkRegister,
  onDownloadTemplate,
}) {
  return (
    <Box className={styles.actions}>
      {showAdd && (
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={onAdd}
        >
          {addLabel}
        </Button>
      )}

      {showBulkRegister && (
        <Button
          variant="outlined"
          startIcon={<UploadFile />}
          onClick={onBulkRegister}
        >
          Bulk Register
        </Button>
      )}

      {showDownloadTemplate && (
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={onDownloadTemplate}
        >
          Download Template
        </Button>
      )}

      {showImport && (
        <Button
          variant="outlined"
          startIcon={<UploadFile />}
          onClick={onImport}
        >
          Import Excel
        </Button>
      )}

      {showExportExcel && (
        <Button
          variant="outlined"
          startIcon={<FileDownload />}
          onClick={onExportExcel}
        >
          Export Excel
        </Button>
      )}

      {showExportPDF && (
        <Button
          variant="outlined"
          startIcon={<PictureAsPdf />}
          onClick={onExportPDF}
        >
          Export PDF
        </Button>
      )}
    </Box>
  );
}