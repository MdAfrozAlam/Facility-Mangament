"use client";

import { useState } from "react";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import { ViewColumn } from "@mui/icons-material";

import styles from "./DataTableToolbar.module.css";

export default function DataTableToolbar({
  searchValue,
  onSearchChange,
  filters = [],
  onClearFilters,
  columns = [],
  columnVisibilityModel = {},
  onColumnVisibilityChange,
  onColumnChange,
}) {
  const [columnAnchorEl, setColumnAnchorEl] = useState(null);
  const handleColumnChange = (field) => {
    onColumnVisibilityChange((prev) => ({
      ...prev,
      [field]: prev[field] === false,
    }));
  };

  // Open Columns menu
  const handleColumnsClick = (event) => {
    setColumnAnchorEl(event.currentTarget);
  };

  // Close Columns menu
  const handleColumnsClose = () => {
    setColumnAnchorEl(null);
  };

  // Reset all columns
  const handleResetColumns = () => {
    onColumnVisibilityChange({});
    handleColumnsClose();
  };

  return (
    <Box className={styles.toolbar}>
      {/* Search */}
      <TextField
        size="small"
        placeholder="Search..."
        value={searchValue}
        onChange={(event) => onSearchChange(event.target.value)}
        className={styles.searchField}
      />

      {/* Filters */}
      {/* {filters.map((filter) => (
        <FormControl
          key={filter.field}
          size="small"
          className={styles.filterField}
        >
          <InputLabel>{filter.label}</InputLabel>

          <Select
            value={filter.value}
            label={filter.label}
            onChange={(event) =>
              filter.onChange(event.target.value)
            }
          >
            <MenuItem value="">
              All {filter.label}
            </MenuItem>

            {filter.options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      ))} */}

      {/* Columns Button */}
      {columns.length > 0 && (
        <>
          <Button
            variant="outlined"
            startIcon={<ViewColumn />}
            onClick={handleColumnsClick}
          ></Button>

          {/* Columns Menu */}
          <Menu
            anchorEl={columnAnchorEl}
            open={Boolean(columnAnchorEl)}
            onClose={handleColumnsClose}
          >
            <FormGroup sx={{ px: 1 }}>
              {columns.map((column) => (
                <FormControlLabel
                  key={column.field}
                  control={
                    <Checkbox
                      checked={columnVisibilityModel[column.field] !== false}
                      onChange={() => handleColumnChange(column.field)}
                    />
                  }
                  label={column.headerName}
                />
              ))}
            </FormGroup>

            {/* Reset Columns */}
            <MenuItem
              onClick={handleResetColumns}
              sx={{
                borderTop: "1px solid #e5e7eb",
                marginTop: "4px",
                fontWeight: 500,
              }}
            >
              Reset Columns
            </MenuItem>
          </Menu>
        </>
      )}

      {/* Clear Filters */}
      {/* <Button
        variant="text"
        onClick={onClearFilters}
        className={styles.clearButton}
      >
        Clear
      </Button> */}
    </Box>
  );
}
