"use client";

import { useMemo, useState } from "react";

import { Button } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { CalendarCog, Hammer, X } from "lucide-react";

import { useForm } from "react-hook-form";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import FormSelect from "../createPPM/FormSelect";
import FormDatePicker from "../createPPM/FormDatePicker";

import {
  ppmProjects,
  ppmBuildings,
  ppmSystems,
  systemTags,
} from "../../data/ppmOptions";

import { plannerRows } from "../../data/ppmPlanner";

import styles from "./Planner.module.css";

const defaultValues = {
  startDate: "",
  endDate: "",
  project: "",
  building: "",
  system: "",
  tag: "",
};

const columns = [
  { field: "pmReference", headerName: "PM Reference", width: 150 },
  { field: "asset", headerName: "Asset", width: 150 },
  { field: "location", headerName: "Location", flex: 1, minWidth: 200 },
  { field: "systemTag", headerName: "System N Tag", flex: 1, minWidth: 220 },
  { field: "category", headerName: "Category", width: 140 },
  { field: "nextDueDate", headerName: "Next Due Date", width: 140 },
  {
    field: "taskInstruction",
    headerName: "Task Instruction",
    flex: 1,
    minWidth: 220,
  },
];

export default function Planner() {
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    defaultValues,
  });

  // null until Build is clicked, so the grid stays hidden.
  const [rows, setRows] = useState(null);

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
   * Build
   */

  const onSubmit = (data) => {
    console.log("PPM Planner filters:", data);

    // Dummy data until the API is available.
    setRows(plannerRows);
  };

  /*
   * Cancel
   */

  const handleCancel = () => {
    reset(defaultValues);
    setRows(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.container}>
        <PageHeader
          title="PPM Planner"
          subtitle="Plan upcoming PPM tasks for a date range."
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
                label: "PPM Planner",
              },
            ]}
          />
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>Planner Criteria</div>

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
                startIcon={<X size={15} />}
                onClick={handleCancel}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                variant="contained"
                startIcon={<Hammer size={15} />}
              >
                Build
              </Button>
            </div>
          </section>
        </form>

        {/* Data Grid */}

        {rows && (
          <div className={styles.gridContainer}>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 25]}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                    page: 0,
                  },
                },
              }}
              disableRowSelectionOnClick
            />
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
}
