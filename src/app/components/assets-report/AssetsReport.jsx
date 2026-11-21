"use client";

import { useMemo, useState } from "react";

import { Button, Collapse } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  BarChart3,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Search,
} from "lucide-react";

import { useForm } from "react-hook-form";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import FormSelect from "../createPPM/FormSelect";
import FormDatePicker from "../createPPM/FormDatePicker";
import DataTableActions from "../common/DataTableActions/DataTableActions";
import DataTableToolbar from "../common/DataTableToolbar/DataTableToolbar";

import { ppmProjects, ppmBuildings } from "../../data/ppmOptions";
import { assetsReportRows } from "../../data/assetsReport";

import { exportToExcel } from "../../utils/excel/exportExcel";
import { exportToPDF } from "../../utils/excel/exportPDF";
import { getDateTimeStamp } from "../../utils/date/formatTimestamp";

import styles from "./AssetsReport.module.css";

const defaultValues = {
  startDate: "",
  endDate: "",
  project: "",
  building: "",
};

// Dates are stored as YYYY-MM-DD; show them as DD/MM/YYYY in the grid.
const formatDate = (value) => {
  if (!value) return "";

  const [year, month, day] = String(value).split("-");

  return day ? `${day}/${month}/${year}` : value;
};

const currencyColumn = {
  type: "number",
  width: 150,
  valueFormatter: (value) =>
    value === "" || value == null ? "" : Number(value).toLocaleString(),
};

const columns = [
  {
    field: "assetCode",
    headerName: "Asset Code",
    minWidth: 260,
    hideable: false,
  },
  { field: "assetName", headerName: "Asset Name", width: 170 },
  { field: "type", headerName: "Type", width: 150 },
  { field: "description", headerName: "Description", minWidth: 260 },
  { field: "system", headerName: "System", width: 170 },
  { field: "subSystem", headerName: "Sub-System", width: 150 },
  { field: "tag", headerName: "Tag", width: 90 },
  { field: "manufacturer", headerName: "Manufacturer", width: 170 },
  { field: "productCode", headerName: "Product Code", width: 140 },
  { field: "model", headerName: "Model", width: 170 },
  { field: "serialNo", headerName: "Serial No", width: 160 },
  { field: "drawing", headerName: "Drawing", width: 150 },
  { field: "maintainabilityType", headerName: "Maintainability Type", width: 190 },
  {
    field: "maintenanceCarriedOutBy",
    headerName: "Maintenance Carried Out By",
    width: 240,
  },
  { field: "isAssetCritical", headerName: "Is Asset Critical?", width: 170 },
  {
    field: "criticalityDescription",
    headerName: "Criticality Description",
    minWidth: 260,
  },
  { field: "project", headerName: "Project", width: 160 },
  { field: "building", headerName: "Building", width: 140 },
  { field: "floor", headerName: "Floor", width: 130 },
  { field: "roomCode", headerName: "Room Code", width: 120 },
  { field: "roomName", headerName: "Room Name", width: 150 },
  { field: "capacity", headerName: "Capacity", width: 120 },
  { field: "quantity", headerName: "Quantity", type: "number", width: 110 },
  { field: "isChildAsset", headerName: "Is Child Asset", width: 140 },
  { field: "assetParentCode", headerName: "Asset Parent Code", minWidth: 260 },
  { field: "comments", headerName: "Comments", minWidth: 220 },
  { field: "financeCode", headerName: "Finance Code", width: 130 },
  { field: "costCentreCode", headerName: "Cost Centre Code", width: 160 },
  { field: "costCode", headerName: "Cost Code", width: 120 },
  { field: "supplier", headerName: "Supplier", width: 190 },
  {
    field: "purchaseDate",
    headerName: "Purchase Date",
    width: 140,
    valueFormatter: formatDate,
  },
  { field: "assetLifetime", headerName: "Asset Lifetime", width: 140 },
  { field: "purchaseCost", headerName: "Purchase Cost", ...currencyColumn },
  {
    field: "acquiredDate",
    headerName: "Acquired Date",
    width: 140,
    valueFormatter: formatDate,
  },
  {
    field: "warrantyDate",
    headerName: "Warranty Date",
    width: 140,
    valueFormatter: formatDate,
  },
  { field: "depreciationMethod", headerName: "Depreciation Method", width: 190 },
  {
    field: "reducingDepreciationPercent",
    headerName: "Reducing Depreciation %",
    type: "number",
    width: 210,
  },
  { field: "depreciationValue", headerName: "Depreciation Value", ...currencyColumn, width: 180 },
  {
    field: "currentValueAsOfMonth",
    headerName: "Current Value As Of Month",
    ...currencyColumn,
    width: 220,
  },
];

export default function AssetsReport() {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  // null until Go is clicked, so the grid stays hidden.
  const [rows, setRows] = useState(null);

  // Criteria used for the current results, summarised while collapsed.
  const [appliedCriteria, setAppliedCriteria] = useState(null);
  const [isCriteriaOpen, setIsCriteriaOpen] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const selectedProject = watch("project");

  /*
   * Buildings based on selected project
   */

  const buildingOptions = useMemo(
    () =>
      ppmBuildings
        .filter((building) => building.projectId === selectedProject)
        .map((building) => ({ value: building.id, label: building.name })),
    [selectedProject]
  );

  const projectOptions = ppmProjects.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  const handleProjectChange = () => {
    setValue("building", "");
  };

  /*
   * Go
   */

  const onSubmit = (data) => {
    // YYYY-MM-DD strings compare correctly as plain strings.
    if (data.startDate && data.endDate && data.endDate < data.startDate) {
      setError("endDate", {
        message: "End Date cannot be before Start Date",
      });
      return;
    }

    // Dummy data until the report API is available; the API will also apply
    // the date range.
    setRows(
      assetsReportRows.filter(
        (row) =>
          (!data.project || row.projectId === data.project) &&
          (!data.building || row.buildingId === data.building)
      )
    );
    setAppliedCriteria(data);
    setSearchText("");
    setIsCriteriaOpen(false);
  };

  /*
   * Clear
   */

  const handleClear = () => {
    reset(defaultValues);
    setRows(null);
    setAppliedCriteria(null);
    setSearchText("");
    setIsCriteriaOpen(true);
  };

  const criteriaSummary = useMemo(() => {
    if (!appliedCriteria) return "";

    const { startDate, endDate, project, building } = appliedCriteria;

    const dateRange =
      startDate || endDate
        ? `${formatDate(startDate) || "Any"} – ${formatDate(endDate) || "Any"}`
        : "All dates";

    return [
      dateRange,
      ppmProjects.find((item) => item.id === project)?.name ?? "All projects",
      ppmBuildings.find((item) => item.id === building)?.name ??
        "All buildings",
    ].join("  ·  ");
  }, [appliedCriteria]);

  /*
   * Search
   */

  const filteredRows = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    if (!rows || !search) return rows;

    return rows.filter((row) =>
      columns.some((column) =>
        String(row[column.field] ?? "")
          .toLowerCase()
          .includes(search)
      )
    );
  }, [rows, searchText]);

  /*
   * Export
   */

  const handleExportExcel = () => {
    exportToExcel({
      data: filteredRows,
      columns,
      columnVisibilityModel,
      fileName: `assets-report-${getDateTimeStamp()}`,
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      data: filteredRows,
      columns,
      columnVisibilityModel,
      fileName: `assets-report-${getDateTimeStamp()}`,
      title: "Assets Report",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.container}>
        <PageHeader
          title="Assets Report"
          subtitle="Generate an assets report for a date range, project and building."
        />

        <div className={styles.breadcrumbWrapper}>
          <Breadcrumbs
            items={[
              {
                label: "Reports",
                icon: <BarChart3 size={18} />,
              },
              {
                label: "Assets Report",
              },
            ]}
          />
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.section}>
            <div
              className={`${styles.sectionHeader} ${
                isCriteriaOpen ? "" : styles.sectionHeaderCollapsed
              }`}
            >
              <div className={styles.sectionTitle}>
                <span>Report Criteria</span>

                {!isCriteriaOpen && criteriaSummary && (
                  <span className={styles.criteriaSummary}>
                    {criteriaSummary}
                  </span>
                )}
              </div>

              <Button
                size="small"
                onClick={() => setIsCriteriaOpen((open) => !open)}
                endIcon={
                  isCriteriaOpen ? (
                    <ChevronUp size={16} />
                  ) : (
                    <ChevronDown size={16} />
                  )
                }
                aria-expanded={isCriteriaOpen}
              >
                {isCriteriaOpen ? "Hide" : "Show"}
              </Button>
            </div>

            <Collapse in={isCriteriaOpen}>
              <div className={styles.sectionBody}>
                <FormDatePicker
                  name="startDate"
                  control={control}
                  label="Start Date"
                  onDateChange={() => clearErrors("endDate")}
                />

                <FormDatePicker
                  name="endDate"
                  control={control}
                  label="End Date"
                  error={errors.endDate}
                  onDateChange={() => clearErrors("endDate")}
                />

                <FormSelect
                  name="project"
                  control={control}
                  label="Project"
                  options={projectOptions}
                  onChange={handleProjectChange}
                />

                <FormSelect
                  name="building"
                  control={control}
                  label="Building"
                  options={buildingOptions}
                  disabled={!selectedProject}
                />
              </div>

              <div className={styles.actions}>
                <Button
                  variant="outlined"
                  startIcon={<RotateCcw size={15} />}
                  onClick={handleClear}
                >
                  Clear
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<Search size={15} />}
                >
                  Go
                </Button>
              </div>
            </Collapse>
          </section>
        </form>

        {/* Data Grid */}

        {rows && (
          <>
            <div className={styles.actionsToolbar}>
              <DataTableActions
                showExportExcel
                showExportPDF
                onExportExcel={handleExportExcel}
                onExportPDF={handleExportPDF}
              />

              <DataTableToolbar
                searchValue={searchText}
                onSearchChange={setSearchText}
                onClearFilters={() => setSearchText("")}
                columns={columns}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityChange={setColumnVisibilityModel}
              />
            </div>

            <div className={styles.gridContainer}>
              <DataGrid
                rows={filteredRows}
                columns={columns}
                getRowId={(row) => row.id}
                columnVisibilityModel={columnVisibilityModel}
                onColumnVisibilityModelChange={setColumnVisibilityModel}
                pageSizeOptions={[5, 10, 25]}
                initialState={{
                  pagination: {
                    paginationModel: {
                      pageSize: 10,
                      page: 0,
                    },
                  },
                }}
                disableRowSelectionOnClick
              />
            </div>
          </>
        )}
      </div>
    </LocalizationProvider>
  );
}
