"use client";

import { useMemo, useState } from "react";

import { Button, TextField } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import {
  CalendarCog,
  Hammer,
  Send,
  SlidersHorizontal,
  X,
} from "lucide-react";

import { useForm } from "react-hook-form";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import DataTableToolbar from "../common/DataTableToolbar/DataTableToolbar";
import DataTableActions from "../common/DataTableActions/DataTableActions";
import ConfirmDialog from "../common/ConfirmDialog/ConfirmDialog";
import FormSelect from "../createPPM/FormSelect";

import { exportToExcel } from "../../utils/excel/exportExcel";
import { exportToPDF } from "../../utils/excel/exportPDF";
import { getDateTimeStamp } from "../../utils/date/formatTimestamp";

import {
  ppmProjects,
  ppmBuildings,
  resources,
} from "../../data/ppmOptions";

import { issuerRows } from "../../data/ppmIssuer";

import styles from "./Issuer.module.css";

const defaultValues = {
  project: "",
  building: "",
  weeksAhead: "",
  presentWeek: "",
  projected: "",
  endingDate: "",
  resource: "",
};

// Dates are stored as YYYY-MM-DD; show them as DD/MM/YYYY in the grid.
const formatDate = (value) => {
  if (!value) return "";

  const [year, month, day] = String(value).split("-");

  return day ? `${day}/${month}/${year}` : value;
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
    field: "dueDate",
    headerName: "Due Date",
    minWidth: 120,
    valueFormatter: formatDate,
  },
  {
    field: "taskInstruction",
    headerName: "Task Instruction",
    minWidth: 220,
  },
  { field: "shift", headerName: "Shift", minWidth: 130 },
  { field: "ppmFamily", headerName: "PPM Family", minWidth: 170 },
];

const emptySelection = { type: "include", ids: new Set() };

export default function Issuer() {
  const { control, register, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues,
  });

  // null until Build is clicked; the criteria are hidden while rows are shown.
  const [rows, setRows] = useState(null);
  const [showCriteria, setShowCriteria] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const [rowSelectionModel, setRowSelectionModel] = useState(emptySelection);
  const [issuedCount, setIssuedCount] = useState(0);

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
   * Selection
   */

  // "Select all" gives an exclude model (every row except the listed ids).
  const selectedRows = filteredRows.filter((row) =>
    rowSelectionModel.type === "include"
      ? rowSelectionModel.ids.has(row.id)
      : !rowSelectionModel.ids.has(row.id)
  );

  /*
   * Build
   */

  const onBuild = (data) => {
    console.log("PM Issuer build:", data);

    // Dummy data until the API is available.
    setRows(issuerRows);
    setSearchText("");
    setRowSelectionModel(emptySelection);
    setShowCriteria(false);
  };

  /*
   * Issue
   */

  const onIssue = (data) => {
    console.log("PM Issuer issue:", data);
  };

  const handleIssueSelected = () => {
    console.log("PM Issuer issue rows:", selectedRows);

    setIssuedCount(selectedRows.length);
  };

  const handleIssuedOk = () => {
    setIssuedCount(0);
    setRowSelectionModel(emptySelection);
  };

  /*
   * Cancel
   */

  const handleCancel = () => {
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
      fileName: `pm-issuer-${getDateTimeStamp()}`,
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      data: filteredRows,
      columns,
      columnVisibilityModel,
      fileName: `pm-issuer-${getDateTimeStamp()}`,
      title: "PM Issuer",
    });
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="PM Issuer"
        subtitle="Issue planned maintenance work orders for upcoming weeks."
      />

      <div className={styles.breadcrumbWrapper}>
        <Breadcrumbs
          items={[
            {
              label: "PPM",
              icon: <CalendarCog size={18} />,
            },
            {
              label: "Issuer",
            },
            {
              label: "PM Issuer",
            },
          ]}
        />
      </div>

      {showCriteria && (
        <form className={styles.form} onSubmit={handleSubmit(onBuild)}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>Issuer Criteria</div>

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
              />

              <TextField
                label="Weeks Ahead"
                size="small"
                type="number"
                fullWidth
                slotProps={{ htmlInput: { min: 0 } }}
                {...register("weeksAhead")}
              />

              <TextField
                label="Present Week"
                size="small"
                fullWidth
                {...register("presentWeek")}
              />

              <TextField
                label="Projected"
                size="small"
                fullWidth
                {...register("projected")}
              />

              <TextField
                label="Ending Date"
                size="small"
                fullWidth
                {...register("endingDate")}
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
                startIcon={<X size={15} />}
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="outlined"
                startIcon={<Hammer size={15} />}
              >
                Build
              </Button>

              <Button
                variant="contained"
                startIcon={<Send size={15} />}
                onClick={handleSubmit(onIssue)}
              >
                Issue
              </Button>
            </div>
          </section>
        </form>
      )}

      {/* Data Grid */}

      {rows && !showCriteria && (
        <>
          <div className={styles.actionsToolbar}>
            <div className={styles.toolbarActions}>
              <Button
                variant="outlined"
                startIcon={<SlidersHorizontal size={15} />}
                onClick={() => setShowCriteria(true)}
              >
                Modify Criteria
              </Button>

              <DataTableActions
                showExportExcel
                showExportPDF
                onExportExcel={handleExportExcel}
                onExportPDF={handleExportPDF}
              />

              <Button
                variant="contained"
                startIcon={<Send size={15} />}
                onClick={handleIssueSelected}
                disabled={selectedRows.length === 0}
              >
                Issue
              </Button>
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
              checkboxSelection
              rowSelectionModel={rowSelectionModel}
              onRowSelectionModelChange={setRowSelectionModel}
              disableRowSelectionOnClick
            />
          </div>
        </>
      )}

      <ConfirmDialog
        open={issuedCount > 0}
        title="PM Issued"
        message={`${issuedCount} PM task${issuedCount === 1 ? "" : "s"} issued successfully.`}
        confirmText="OK"
        showCancel={false}
        onConfirm={handleIssuedOk}
        onCancel={handleIssuedOk}
      />
    </div>
  );
}
