"use client";

import { useMemo, useState } from "react";

import { Button } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { CalendarCog, Eraser, Search, SlidersHorizontal } from "lucide-react";

import { useForm } from "react-hook-form";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import DataTableToolbar from "../common/DataTableToolbar/DataTableToolbar";
import DataTableActions from "../common/DataTableActions/DataTableActions";
import FormSelect from "../createPPM/FormSelect";

import { exportToExcel } from "../../utils/excel/exportExcel";
import { exportToPDF } from "../../utils/excel/exportPDF";
import { getDateTimeStamp } from "../../utils/date/formatTimestamp";

import {
  ppmProjects,
  ppmBuildings,
  ppmProperties,
  serviceFrequencies,
  instructionSets,
  ppmCategories,
  systemTags,
  resources,
} from "../../data/ppmOptions";

import { schedulerGridRows } from "../../data/ppmScheduler";

import styles from "./scheduler.module.css";

const defaultValues = {
  project: "",
  building: "",
  property: "",
  serviceFrequency: "",
  taskInstructions: "",
  category: "",
  systemTag: "",
  resource: "",
};

// Dates are stored as YYYY-MM-DD; show them as DD/MM/YYYY in the grid.
const formatDate = (value) => {
  if (!value) return "";

  const [year, month, day] = String(value).split("-");

  return day ? `${day}/${month}/${year}` : value;
};

const priorityClassNames = {
  Low: styles.priorityLow,
  Medium: styles.priorityMedium,
  High: styles.priorityHigh,
  Critical: styles.priorityCritical,
};

const columns = [
  { field: "pmCode", headerName: "PM Code", minWidth: 130, hideable: false },
  { field: "asset", headerName: "Asset", minWidth: 130 },
  { field: "assetName", headerName: "Asset Name", minWidth: 200 },
  { field: "project", headerName: "Project", minWidth: 150 },
  { field: "building", headerName: "Building", minWidth: 140 },
  { field: "floor", headerName: "Floor", minWidth: 120 },
  { field: "unit", headerName: "Unit", minWidth: 110 },
  { field: "room", headerName: "Room", minWidth: 150 },
  {
    field: "priority",
    headerName: "Priority",
    minWidth: 110,
    renderCell: (params) => (
      <span
        className={`${styles.badge} ${priorityClassNames[params.value] ?? ""}`}
      >
        {params.value}
      </span>
    ),
  },
  { field: "resource", headerName: "Resource", minWidth: 150 },
  {
    field: "createdDate",
    headerName: "Created Date",
    minWidth: 130,
    valueFormatter: formatDate,
  },
  {
    field: "serviceFrequency",
    headerName: "Service Frequency",
    minWidth: 150,
  },
  {
    field: "startOfCycle",
    headerName: "Start of Cycle",
    minWidth: 130,
    valueFormatter: formatDate,
  },
  {
    field: "nextServiceDate",
    headerName: "Next Service Date",
    minWidth: 150,
    valueFormatter: formatDate,
  },
  { field: "taskInstruction", headerName: "Task Instruction", minWidth: 220 },
  { field: "systemTag", headerName: "System Tag", minWidth: 220 },
  { field: "category", headerName: "Category", minWidth: 120 },
  {
    field: "includeConditionAudit",
    headerName: "Include Condition Audit",
    minWidth: 190,
  },
];

export default function Scheduler() {
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues,
  });

  // null until Go is clicked; the filters are hidden while rows are shown.
  const [rows, setRows] = useState(null);
  const [showFilters, setShowFilters] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const selectedProject = watch("project");
  const selectedBuilding = watch("building");

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

  /*
   * Properties based on selected building
   */

  const propertyOptions = useMemo(
    () =>
      ppmProperties
        .filter((property) => property.buildingId === selectedBuilding)
        .map((property) => ({ value: property.id, label: property.name })),
    [selectedBuilding]
  );

  const projectOptions = ppmProjects.map((project) => ({
    value: project.id,
    label: project.name,
  }));

  const handleProjectChange = () => {
    setValue("building", "");
    setValue("property", "");
  };

  const handleBuildingChange = () => {
    setValue("property", "");
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
    console.log("PPM Scheduler Grid filters:", data);

    // Dummy data until the API is available.
    setRows(schedulerGridRows);
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
      fileName: `ppm-scheduler-grid-${getDateTimeStamp()}`,
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      data: filteredRows,
      columns,
      columnVisibilityModel,
      fileName: `ppm-scheduler-grid-${getDateTimeStamp()}`,
      title: "PPM Scheduler Grid",
    });
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="PPM Scheduler Grid"
        subtitle="Filter and view scheduled PPM tasks."
      />

      <div className={styles.breadcrumbWrapper}>
        <Breadcrumbs
          items={[
            {
              label: "PPM",
              icon: <CalendarCog size={18} />,
            },
            {
              label: "Scheduler",
            },
            {
              label: "PPM Scheduler Grid",
            },
          ]}
        />
      </div>

      {showFilters && (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>Filters</div>

            <div className={styles.sectionBody}>
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
                onChange={handleBuildingChange}
              />

              <FormSelect
                name="property"
                control={control}
                label="Property"
                options={propertyOptions}
                disabled={!selectedBuilding}
              />

              <FormSelect
                name="serviceFrequency"
                control={control}
                label="Service Frequency"
                options={serviceFrequencies}
              />

              <FormSelect
                name="taskInstructions"
                control={control}
                label="Task Instructions"
                options={instructionSets}
              />

              <FormSelect
                name="category"
                control={control}
                label="Category"
                options={ppmCategories}
              />

              <FormSelect
                name="systemTag"
                control={control}
                label="System Tag"
                options={systemTags}
              />

              <FormSelect
                name="resource"
                control={control}
                label="Resources"
                options={resources}
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
  );
}
