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
import {
  workOrderTypes,
  workOrderStatuses,
} from "../../data/ppmWorkOrders";
import { ppmReportRows } from "../../data/ppmReport";

import { exportToExcel } from "../../utils/excel/exportExcel";
import { exportToPDF } from "../../utils/excel/exportPDF";
import { getDateTimeStamp } from "../../utils/date/formatTimestamp";

import styles from "./PPMReport.module.css";

const defaultValues = {
  startDate: "",
  endDate: "",
  project: "",
  building: "",
  workOrderType: "",
  status: "",
};

// Dates are stored as YYYY-MM-DD; show them as DD/MM/YYYY in the grid.
const formatDate = (value) => {
  if (!value) return "";

  const [year, month, day] = String(value).split("-");

  return day ? `${day}/${month}/${year}` : value;
};

const statusClassNames = {
  Open: styles.statusOpen,
  "In Progress": styles.statusInProgress,
  "On Hold": styles.statusOnHold,
  Completed: styles.statusCompleted,
  Closed: styles.statusClosed,
  Cancelled: styles.statusCancelled,
};

const dateColumn = {
  width: 150,
  valueFormatter: formatDate,
};

const columns = [
  {
    field: "assetCode",
    headerName: "Asset Code",
    minWidth: 260,
    hideable: false,
  },
  { field: "assetDescription", headerName: "Asset Description", minWidth: 260 },
  { field: "workOrder", headerName: "Work Order", width: 150 },
  { field: "project", headerName: "Project", width: 160 },
  { field: "building", headerName: "Building", width: 140 },
  { field: "concept", headerName: "Concept", width: 140 },
  { field: "storeCode", headerName: "Store Code", width: 130 },
  { field: "floor", headerName: "Floor", width: 130 },
  { field: "room", headerName: "Room", width: 150 },
  { field: "region", headerName: "Region", width: 120 },
  { field: "tradeCategory", headerName: "Trade Category", width: 170 },
  { field: "category", headerName: "Category", width: 170 },
  { field: "description", headerName: "Description", minWidth: 280 },
  {
    field: "status",
    headerName: "Status",
    width: 140,
    renderCell: (params) => (
      <span
        className={`${styles.status} ${statusClassNames[params.value] ?? ""}`}
      >
        {params.value}
      </span>
    ),
  },
  { field: "levelOfCompletion", headerName: "Level of Completion", width: 190 },
  { field: "ageing", headerName: "Ageing", type: "number", width: 100 },
  { field: "ppmIssuedDate", headerName: "PPM Issued Date", ...dateColumn, width: 170 },
  { field: "dueDate", headerName: "Due Date", ...dateColumn },
  { field: "completedDate", headerName: "Completed Date", ...dateColumn, width: 160 },
  { field: "onHoldDate", headerName: "On Hold Date", ...dateColumn },
  { field: "onHoldReason", headerName: "On Hold Reason", minWidth: 220 },
  { field: "reAssignedDate", headerName: "ReAssigned Date", ...dateColumn, width: 160 },
  { field: "remarks", headerName: "Remarks", minWidth: 240 },
  { field: "resource", headerName: "Resource", width: 180 },
];

export default function PPMReport() {
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
      ppmReportRows.filter(
        (row) =>
          (!data.project || row.projectId === data.project) &&
          (!data.building || row.buildingId === data.building) &&
          (!data.workOrderType || row.workOrderType === data.workOrderType) &&
          (!data.status || row.status === data.status)
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

    const { startDate, endDate, project, building, workOrderType, status } =
      appliedCriteria;

    const dateRange =
      startDate || endDate
        ? `${formatDate(startDate) || "Any"} – ${formatDate(endDate) || "Any"}`
        : "All dates";

    return [
      dateRange,
      ppmProjects.find((item) => item.id === project)?.name ?? "All projects",
      ppmBuildings.find((item) => item.id === building)?.name ??
        "All buildings",
      workOrderType || "All types",
      status || "All statuses",
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
      fileName: `ppm-report-${getDateTimeStamp()}`,
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      data: filteredRows,
      columns,
      columnVisibilityModel,
      fileName: `ppm-report-${getDateTimeStamp()}`,
      title: "PPM Report",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.container}>
        <PageHeader
          title="PPM Report"
          subtitle="Generate a PPM work order report for a date range, project and building."
        />

        <div className={styles.breadcrumbWrapper}>
          <Breadcrumbs
            items={[
              {
                label: "Reports",
                icon: <BarChart3 size={18} />,
              },
              {
                label: "PPM Report",
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

                <FormSelect
                  name="workOrderType"
                  control={control}
                  label="Work Order Type"
                  options={workOrderTypes}
                />

                <FormSelect
                  name="status"
                  control={control}
                  label="Status"
                  options={workOrderStatuses}
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
