"use client";

import { useMemo, useState } from "react";

import { Button } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { CalendarCog, Eraser, Search, SlidersHorizontal } from "lucide-react";

import { useForm } from "react-hook-form";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import DataTableToolbar from "../common/DataTableToolbar/DataTableToolbar";
import DataTableActions from "../common/DataTableActions/DataTableActions";
import FormSelect from "../createPPM/FormSelect";
import FormDatePicker from "../createPPM/FormDatePicker";

import { exportToExcel } from "../../utils/excel/exportExcel";
import { exportToPDF } from "../../utils/excel/exportPDF";
import { getDateTimeStamp } from "../../utils/date/formatTimestamp";

import {
  ppmProjects,
  ppmBuildings,
  ppmSystems,
  systemTags,
} from "../../data/ppmOptions";

import { plannerGridRows } from "../../data/ppmPlanner";

import styles from "./Planner.module.css";

const defaultValues = {
  startDate: "",
  endDate: "",
  project: "",
  building: "",
  system: "",
  tag: "",
};

// Dates are stored as YYYY-MM-DD; show them as DD/MM/YYYY in the grid.
const formatDate = (value) => {
  if (!value) return "";

  const [year, month, day] = String(value).split("-");

  return day ? `${day}/${month}/${year}` : value;
};

const statusClassNames = {
  Scheduled: styles.statusScheduled,
  "In Progress": styles.statusInProgress,
  Completed: styles.statusCompleted,
  Overdue: styles.statusOverdue,
};

const columns = [
  { field: "yearWeek", headerName: "Year Week", minWidth: 110 },
  {
    field: "pmReference",
    headerName: "PM Reference",
    minWidth: 150,
    hideable: false,
  },
  { field: "pmCode", headerName: "PM Code", minWidth: 130 },
  { field: "asset", headerName: "Asset", minWidth: 130 },
  { field: "project", headerName: "Project", minWidth: 150 },
  { field: "building", headerName: "Building", minWidth: 140 },
  { field: "location", headerName: "Location", minWidth: 140 },
  { field: "systemTag", headerName: "System Tag", minWidth: 220 },
  { field: "category", headerName: "Category", minWidth: 120 },
  {
    field: "serviceFrequency",
    headerName: "Service Frequency",
    minWidth: 150,
  },
  {
    field: "nextServiceDate",
    headerName: "Next Service Date",
    minWidth: 150,
    valueFormatter: formatDate,
  },
  {
    field: "taskInstruction",
    headerName: "Task Instruction",
    minWidth: 220,
  },
  { field: "resource", headerName: "Resource", minWidth: 150 },
  {
    field: "currentStatus",
    headerName: "Current Status",
    minWidth: 140,
    renderCell: (params) => (
      <span
        className={`${styles.status} ${statusClassNames[params.value] ?? ""}`}
      >
        {params.value}
      </span>
    ),
  },
];

export default function PlannerGrid() {
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
    console.log("PPM Planner Grid filters:", data);

    // Dummy data until the API is available.
    setRows(plannerGridRows);
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
      fileName: `ppm-planner-grid-${getDateTimeStamp()}`,
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      data: filteredRows,
      columns,
      columnVisibilityModel,
      fileName: `ppm-planner-grid-${getDateTimeStamp()}`,
      title: "PPM Planner Grid",
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.container}>
        <PageHeader
          title="PPM Planner Grid"
          subtitle="Filter and view planned PPM tasks."
        />

        <div className={styles.breadcrumbWrapper}>
          <Breadcrumbs
            items={[
              {
                label: "PPM",
                icon: <CalendarCog size={18} />,
              },
              {
                label: "Planner",
              },
              {
                label: "PPM Planner Grid",
              },
            ]}
          />
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
                  name="system"
                  control={control}
                  label="System"
                  options={ppmSystems}
                />

                <FormSelect
                  name="tag"
                  control={control}
                  label="Tag"
                  options={systemTags}
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
