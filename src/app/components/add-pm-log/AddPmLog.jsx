"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

import { Button, TextField } from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { CalendarCog, Check, X } from "lucide-react";

import { Controller, useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import FormSelect from "../createPPM/FormSelect";
import FormDatePicker from "../createPPM/FormDatePicker";

import {
  ppmProjects,
  ppmBuildings,
  ppmProperties,
  ppmCategories,
  priorities,
} from "../../data/ppmOptions";

import {
  ppmUnits,
  ppmRooms,
  workOrderRows,
  workOrderTypes,
  workOrderSubtypes,
  workOrderChannels,
  workOrderLocs,
} from "../../data/ppmWorkOrders";

import { pmLogSchema } from "../../schemas/pmLogSchema";

import styles from "./AddPmLog.module.css";

const ALL_WORK_ORDER_PATH = "/admin/planned-maintenance/pm-log/all-work-order";

const defaultValues = {
  project: "",
  building: "",
  floor: "",
  unit: "",
  room: "",

  title: "",
  type: "",
  subtype: "",
  category: "",
  channel: "",
  loc: "",
  locDate: "",
  ppmId: "",
  parentWo: "",
  summary: "",
  priority: "",
};

const toOptions = (items) =>
  items.map((item) => ({ value: item.id, label: item.name }));

const projectOptions = toOptions(ppmProjects);

const parentWoOptions = workOrderRows.map((row) => row.workOrderNo);

export default function AddPmLog() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(pmLogSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const [
    selectedProject,
    selectedBuilding,
    selectedFloor,
    selectedUnit,
    selectedType,
  ] = watch(["project", "building", "floor", "unit", "type"]);

  /*
   * Cascading location options
   */

  const buildingOptions = useMemo(
    () =>
      toOptions(
        ppmBuildings.filter(
          (building) => building.projectId === selectedProject
        )
      ),
    [selectedProject]
  );

  const floorOptions = useMemo(
    () =>
      toOptions(
        ppmProperties.filter((floor) => floor.buildingId === selectedBuilding)
      ),
    [selectedBuilding]
  );

  const unitOptions = useMemo(
    () => toOptions(ppmUnits.filter((unit) => unit.floorId === selectedFloor)),
    [selectedFloor]
  );

  const roomOptions = useMemo(
    () => toOptions(ppmRooms.filter((room) => room.unitId === selectedUnit)),
    [selectedUnit]
  );

  const subtypeOptions = workOrderSubtypes[selectedType] ?? [];

  // Changing a parent field clears everything below it.
  const clearFields = (fields) => {
    fields.forEach((field) => setValue(field, ""));
  };

  /*
   * Save
   */

  const onSubmit = (data) => {
    console.log("PM Log:", data);

    // API call will be added here later.

    router.push(ALL_WORK_ORDER_PATH);
  };

  /*
   * Cancel
   */

  const handleCancel = () => {
    router.push(ALL_WORK_ORDER_PATH);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className={styles.container}>
        <PageHeader
          title="Add PM Log"
          subtitle="Log a new work order against a location."
        />

        <div className={styles.breadcrumbWrapper}>
          <Breadcrumbs
            items={[
              {
                label: "PPM",
                icon: <CalendarCog size={18} />,
              },
              {
                label: "PM Log",
              },
              {
                label: "Add PM Log",
              },
            ]}
          />
        </div>

        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {/* Account */}

          <section className={styles.section}>
            <div className={styles.sectionHeader}>Account</div>

            <div className={styles.sectionBody}>
              <FormSelect
                name="project"
                control={control}
                label="Project"
                options={projectOptions}
                required
                error={errors.project}
                onChange={() =>
                  clearFields(["building", "floor", "unit", "room"])
                }
              />

              <FormSelect
                name="building"
                control={control}
                label="Building"
                options={buildingOptions}
                required
                disabled={!selectedProject}
                error={errors.building}
                onChange={() => clearFields(["floor", "unit", "room"])}
              />

              <FormSelect
                name="floor"
                control={control}
                label="Floor"
                options={floorOptions}
                disabled={!selectedBuilding}
                onChange={() => clearFields(["unit", "room"])}
              />

              <FormSelect
                name="unit"
                control={control}
                label="Unit"
                options={unitOptions}
                disabled={!selectedFloor}
                onChange={() => clearFields(["room"])}
              />

              <FormSelect
                name="room"
                control={control}
                label="Room"
                options={roomOptions}
                disabled={!selectedUnit}
              />
            </div>
          </section>

          {/* General */}

          <section className={styles.section}>
            <div className={styles.sectionHeader}>General</div>

            <div className={styles.sectionBody}>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    label="Title"
                    required
                    error={Boolean(errors.title)}
                    helperText={errors.title?.message}
                    className={styles.fullWidth}
                  />
                )}
              />

              <FormSelect
                name="type"
                control={control}
                label="Type"
                options={workOrderTypes}
                required
                error={errors.type}
                onChange={() => clearFields(["subtype"])}
              />

              <FormSelect
                name="subtype"
                control={control}
                label="Subtype"
                options={subtypeOptions}
                disabled={!selectedType}
              />

              <FormSelect
                name="category"
                control={control}
                label="Category"
                options={ppmCategories}
                required
                error={errors.category}
              />

              <FormSelect
                name="channel"
                control={control}
                label="Channel"
                options={workOrderChannels}
                required
                error={errors.channel}
              />

              <FormSelect
                name="loc"
                control={control}
                label="LOC"
                options={workOrderLocs}
              />

              <FormDatePicker name="locDate" control={control} label="LOC Date" />

              <Controller
                name="ppmId"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth size="small" label="PPM Id" />
                )}
              />

              <FormSelect
                name="parentWo"
                control={control}
                label="Parent WO"
                options={parentWoOptions}
              />

              <FormSelect
                name="priority"
                control={control}
                label="Priority"
                options={priorities}
                required
                error={errors.priority}
              />

              <Controller
                name="summary"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    multiline
                    minRows={3}
                    size="small"
                    label="Summary"
                    className={styles.fullWidth}
                  />
                )}
              />
            </div>
          </section>

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
              startIcon={<Check size={16} />}
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </LocalizationProvider>
  );
}
