"use client";

import { useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Typography,
} from "@mui/material";

import {
  CloudUpload,
  Download,
  InsertDriveFile,
} from "@mui/icons-material";

import { validateAssetRegisterExcel } from "../../utils/excel/validateAssetRegister";

import DialogHeader from "../common/DialogHeader/DialogHeader";

import styles from "./BulkRegisterDialog.module.css";

export default function BulkRegisterDialog({
  open,
  onClose,
  onDownloadTemplate,
  columns,
  existingAssets = [],
}) {
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [validationResult, setValidationResult] =
    useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileSelect = (event) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);
    setValidationResult(null);
    setError("");
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleContinue = async () => {
    if (!file) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const result = await validateAssetRegisterExcel({
        file,
        columns,
        existingAssets,
      });

      setValidationResult(result);
    } catch (error) {
      setError(
        error.message || "Unable to validate the Excel file."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setValidationResult(null);
    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogHeader
        title="Bulk Register"
        onClose={handleClose}
      />

      <DialogContent>
        {!validationResult ? (
          <>
            <Typography className={styles.description}>
              Upload an Excel file containing the assets you
              want to register.
            </Typography>

            <Box className={styles.templateBox}>
              <Typography>
                Dont have the template?
              </Typography>

              <Button
                variant="text"
                startIcon={<Download />}
                onClick={onDownloadTemplate}
              >
                Download Template
              </Button>
            </Box>

            <Box
              className={styles.uploadBox}
              onClick={handleChooseFile}
            >
              <CloudUpload className={styles.uploadIcon} />

              <Typography className={styles.uploadTitle}>
                Upload Excel file
              </Typography>

              <Typography className={styles.uploadDescription}>
                Click to browse or select an Excel file
              </Typography>

              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                hidden
                onChange={handleFileSelect}
              />
            </Box>

            {file && (
              <Box className={styles.filePreview}>
                <InsertDriveFile />

                <Box>
                  <Typography className={styles.fileName}>
                    {file.name}
                  </Typography>

                  <Typography className={styles.fileSize}>
                    {(file.size / 1024).toFixed(1)} KB
                  </Typography>
                </Box>
              </Box>
            )}

            {error && (
              <Box className={styles.errorBox}>
                {error}
              </Box>
            )}
          </>
        ) : (
          <ValidationSummary
            result={validationResult}
          />
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>
          Cancel
        </Button>

        {!validationResult && (
          <Button
            variant="contained"
            disabled={!file || loading}
            onClick={handleContinue}
          >
            {loading ? "Validating..." : "Continue"}
          </Button>
        )}

        {validationResult && (
          <Button
            variant="contained"
            disabled={
              validationResult.validRecords === 0
            }
            onClick={() => {
              console.log(
                "Register:",
                validationResult.validRows
              );
            }}
          >
            Register {validationResult.validRecords} Assets
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  function ValidationSummary({ result }) {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2 }}
      >
        Bulk Registration Preview
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns:
            "repeat(3, 1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        <SummaryCard
          label="Total Records"
          value={result.totalRecords}
        />

        <SummaryCard
          label="Valid Records"
          value={result.validRecords}
        />

        <SummaryCard
          label="Invalid Records"
          value={result.invalidRecords}
        />
      </Box>

      {result.invalidRecords > 0 && (
        <Box>
          <Typography
            sx={{
              fontWeight: 600,
              mb: 1,
            }}
          >
            Records requiring attention
          </Typography>

          {result.invalidRows.map((row) => (
            <Box
              key={row.rowNumber}
              sx={{
                p: 1.5,
                mb: 1,
                border: "1px solid #fecaca",
                borderRadius: 1,
                background: "#fef2f2",
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Excel Row {row.rowNumber}
              </Typography>

              {row.errors.map((error) => (
                <Typography
                  key={error}
                  sx={{
                    fontSize: 13,
                    color: "#b91c1c",
                  }}
                >
                  • {error}
                </Typography>
              ))}
            </Box>
          ))}
        </Box>
      )}

      {result.validRecords > 0 &&
        result.invalidRecords === 0 && (
          <Box
            sx={{
              p: 2,
              borderRadius: 1,
              background: "#f0fdf4",
              color: "#166534",
            }}
          >
            All {result.validRecords} records are valid
            and ready to register.
          </Box>
        )}
    </Box>
  );
}

function SummaryCard({ label, value }) {
  return (
    <Box
      sx={{
        p: 2,
        border: "1px solid #e2e8f0",
        borderRadius: 2,
        background: "#f8fafc",
      }}
    >
      <Typography
        sx={{
          fontSize: 13,
          color: "#64748b",
        }}
      >
        {label}
      </Typography>

      <Typography
        sx={{
          mt: 0.5,
          fontSize: 24,
          fontWeight: 600,
          color: "#0f172a",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
}