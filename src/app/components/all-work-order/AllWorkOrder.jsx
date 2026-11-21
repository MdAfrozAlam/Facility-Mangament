"use client";

import { useMemo, useState } from "react";

import { Button, TextField } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { CalendarCog, Eraser, Search, SlidersHorizontal } from "lucide-react";

import { Controller, useForm } from "react-hook-form";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import DataTableToolbar from "../common/DataTableToolbar/DataTableToolbar";
import DataTableActions from "../common/DataTableActions/DataTableActions";
import FormSelect from "../createPPM/FormSelect";
import FormDatePicker from "../createPPM/FormDatePicker";

import { exportToExcel } from "../../utils/excel/exportExcel";
import { exportToPDF } from "../../utils/excel/exportPDF";
import { getDateTimeStamp } from "../../utils/date/formatTimestamp";

import { ppmProjects, ppmBuildings } from "../../data/ppmOptions";

import {
  workOrderRows,
  workOrderTypes,
  workOrderStatuses,
  workOrderLocs,
} from "../../data/ppmWorkOrders";

import styles from "./AllWorkOrder.module.css";

const defaultValues = {
  startDate: "",
  endDate: "",
  project: "",
  building: "",
  type: "",
  status: "",
  loc: "",
  workOrderSearch: "",
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

const columns = [
  {
    field: "workOrderNo",
    headerName: "Work Order No",
    minWidth: 150,
    hideable: false,
  },
  { field: "project", headerName: "Project", minWidth: 150 },
  { field: "building", headerName: "Building", minWidth: 140 },
  { field: "floor", headerName: "Floor", minWidth: 120 },
  { field: "unit", headerName: "Unit", minWidth: 110 },
  { field: "room", headerName: "Room", minWidth: 140 },
  { field: "type", headerName: "Type", minWidth: 110 },
  { field: "category", headerName: "Category", minWidth: 120 },
  { field: "channel", headerName: "Channel", minWidth: 120 },
  {
    field: "loggedDate",
    headerName: "Logged Date",
    minWidth: 120,
    valueFormatter: formatDate,
  },
  {
    field: "scheduleDate",
    headerName: "Schedule Date",
    minWidth: 130,
    valueFormatter: formatDate,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    minWidth: 120,
    valueFormatter: formatDate,
  },
  { field: "assetCode", headerName: "Asset Code", minWidth: 260 },
  {
    field: "assetDescription",
    headerName: "Asset Description",
    minWidth: 200,
  },
  { field: "title", headerName: "Title", minWidth: 220 },
  { field: "priority", headerName: "Priority", minWidth: 110 },
  {
    field: "status",
    headerName: "Status",
    minWidth: 130,
    renderCell: (params) => (
      <span
        className={`${styles.status} ${statusClassNames[params.value] ?? ""}`}
      >
        {params.value}
      </span>
    ),
  },
  { field: "loc", headerName: "LOC", minWidth: 130 },
  { field: "age", headerName: "Age", minWidth: 100 },
  { field: "resource", headerName: "Resource", minWidth: 150 },
  { field: "loggedBy", headerName: "Logged By", minWidth: 130 },
  { field: "reporter", headerName: "Reporter", minWidth: 140 },
  { field: "refNo", headerName: "Ref No", minWidth: 120 },
  { field: "summary", headerName: "Summary", minWidth: 280 },
];

const defaultBreadcrumbs = [
  {
    label: "PPM",
    icon: <CalendarCog size={18} />,
  },
  {
    label: "PM Log",
  },
  {
    label: "All Work Orders",
  },
];

export default function AllWorkOrder({ breadcrumbs = defaultBreadcrumbs }) {
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues,
  });

  // null until Go is clicked; the filters are hidden while rows are shown.
  const [rows, setRows] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

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
   * Search
   */

  const filteredRows = useMemo(() => {
    if (!rows) return [];

    const search = searchText.toLowerCase().trim();

    if (!search) return rows;

    return rows.filter((row) =>
      columns.some((column) =>
        String(row[column.field] ?? "")
          .toLowerCase()
          .includes(search)
      )
    );
  }, [rows, searchText]);

  /*
   * Go
   */

  const onSubmit = (data) => {
    console.log("All Work Order filters:", data);

    // Dummy data filtered client-side until the API is available.
    const projectName = ppmProjects.find(
      (project) => project.id === data.project
    )?.name;

    const buildingName = ppmBuildings.find(
      (building) => building.id === data.building
    )?.name;

    const workOrderSearch = data.workOrderSearch.toLowerCase().trim();

    setRows(
      workOrderRows.filter(
        (row) =>
          (!data.startDate || row.loggedDate >= data.startDate) &&
          (!data.endDate || row.loggedDate <= data.endDate) &&
          (!projectName || row.project === projectName) &&
          (!buildingName || row.building === buildingName) &&
          (!data.type || row.type === data.type) &&
          (!data.status || row.status === data.status) &&
          (!data.loc || row.loc === data.loc) &&
          (!workOrderSearch ||
            row.workOrderNo.toLowerCase().includes(workOrderSearch))
      )
    );
    setSearchText("");
    setShowFilters(false);
  };

  /*
   * Clear
   */

  const handleClear = () => {
    reset(defaultValues);
    setRows(null);
    setSearchText("");
  };

  /*
   * Export
   */

  const handleExportExcel = () => {
    exportToExcel({
      data: filteredRows,
      columns,
      columnVisibilityModel,
      fileName: `all-work-orders-${getDateTimeStamp()}`,
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      data: filteredRows,
      columns,
      columnVisibilityModel,
      fileName: `all-work-orders-${getDateTimeStamp()}`,
      title: "All Work Orders",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.container}>
        <PageHeader
          title="All Work Orders"
          subtitle="Filter and view logged work orders."
        />

        <div className={styles.breadcrumbWrapper}>
          <Breadcrumbs items={breadcrumbs} />
        </div>

        {showFilters && (
          <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>Filters</div>

              <div className={styles.sectionBody}>
                <FormDatePicker
                  name="startDate"
                  control={control}
                  label="Start Date"
                />

                <FormDatePicker
                  name="endDate"
                  control={control}
                  label="End Date"
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
                  name="type"
                  control={control}
                  label="Type"
                  options={workOrderTypes}
                />

                <FormSelect
                  name="status"
                  control={control}
                  label="Status"
                  options={workOrderStatuses}
                />

                <FormSelect
                  name="loc"
                  control={control}
                  label="LOC"
                  options={workOrderLocs}
                />

                <Controller
                  name="workOrderSearch"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Work Order Search"
                      placeholder="Enter Work Order No"
                    />
                  )}
                />
              </div>

              <div className={styles.actions}>
                <Button
                  variant="outlined"
                  startIcon={<Eraser size={15} />}
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
            </section>
          </form>
        )}

        {/* Data Grid */}

        {rows && !showFilters && (
          <>
            <div className={styles.actionsToolbar}>
              <div className={styles.toolbarActions}>
                <Button
                  variant="outlined"
                  startIcon={<SlidersHorizontal size={15} />}
                  onClick={() => setShowFilters(true)}
                >
                  Modify Filters
                </Button>

                <DataTableActions
                  showExportExcel
                  showExportPDF
                  onExportExcel={handleExportExcel}
                  onExportPDF={handleExportPDF}
                />
              </div>

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
