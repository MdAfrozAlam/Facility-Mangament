"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "../common/PageHeader/PageHeader";


import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";

import {
  ArrowLeft,
  Check,
  X,
  CalendarCog,
  ImageOff,
} from "lucide-react";

import {
  LocalizationProvider,
} from "@mui/x-date-pickers";

import {
  AdapterDayjs,
} from "@mui/x-date-pickers/AdapterDayjs";

import {
  DatePicker,
} from "@mui/x-date-pickers/DatePicker";

import dayjs from "dayjs";

import {
  Controller,
  useForm,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import Breadcrumbs from "../../components/common/Breadcrumbs/Breadcrumbs";

import {
  ppmProjects,
  ppmBuildings,
  ppmAssets,
  instructionSets,
  priorities,
  financeCodes,
  costCenters,
  costCodes,
  resources,
  shifts,
  frequencyTypes,
} from "../../data/ppmOptions";

import { ppmSchema } from "../../schemas/ppmSchema";

import styles from "./CreatePPM.module.css";

const defaultValues = {
  project: "",
  building: "",
  asset: "",

  assetId: "",
  assetName: "",
  location: "",
  qty: 1,

  ppmCode: "",
  instructionSet: "",
  family: "",
  priority: "",

  estimationTime: "",
  estimationMen: "",
  stocklabCost: "",
  totalCost: "",

  financeCode: "",
  costCenter: "",
  costCode: "",
  resource: "",

  designation: "",
  shift: "",

  permitRequired: false,
  healthSafety: false,

  lastService: "",
  serviceFrequency: "",
  frequencyType: "",
  nextDue: "",
  week: "",
};

export default function CreatePPM() {
  const router = useRouter();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ppmSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const selectedProject = watch("project");
  const selectedBuilding = watch("building");
  const selectedAsset = watch("asset");

  const serviceFrequency = watch("serviceFrequency");
  const frequencyType = watch("frequencyType");

  /*
   * Buildings based on selected project
   */

  const filteredBuildings = useMemo(() => {
    if (!selectedProject) {
      return [];
    }

    return ppmBuildings.filter(
      (building) =>
        building.projectId === selectedProject
    );
  }, [selectedProject]);

  /*
   * Assets based on project + building
   */

  const filteredAssets = useMemo(() => {
    if (!selectedProject || !selectedBuilding) {
      return [];
    }

    return ppmAssets.filter(
      (asset) =>
        asset.projectId === selectedProject &&
        asset.buildingId === selectedBuilding
    );
  }, [
    selectedProject,
    selectedBuilding,
  ]);

  /*
   * Selected asset record (drives the image preview)
   */

  const selectedAssetRecord = useMemo(
    () =>
      ppmAssets.find(
        (asset) => asset.id === selectedAsset
      ) || null,
    [selectedAsset]
  );

  // Image URL that failed to load; falls back to the placeholder.
  const [brokenImage, setBrokenImage] = useState(null);

  /*
   * Calculate Next Due
   */

  const calculateNextDue = (
    date,
    frequency,
    type
  ) => {
    if (
      !date ||
      !frequency ||
      !type
    ) {
      return "";
    }

    const numericFrequency = Number(frequency);

    if (
      !numericFrequency ||
      numericFrequency <= 0
    ) {
      return "";
    }

    let nextDate = dayjs(date);

    switch (type) {
      case "Days":
        nextDate = nextDate.add(
          numericFrequency,
          "day"
        );
        break;

      case "Weeks":
        nextDate = nextDate.add(
          numericFrequency,
          "week"
        );
        break;

      case "Months":
        nextDate = nextDate.add(
          numericFrequency,
          "month"
        );
        break;

      case "Years":
        nextDate = nextDate.add(
          numericFrequency,
          "year"
        );
        break;

      default:
        return "";
    }

    return nextDate.format("YYYY-MM-DD");
  };

  /*
   * Update next due
   */

  const updateNextDue = (
    date,
    frequency,
    type
  ) => {
    const nextDue = calculateNextDue(
      date,
      frequency,
      type
    );

    setValue("nextDue", nextDue);
  };

  /*
   * Project change
   */

  const handleProjectChange = (value) => {
    setValue("project", value);

    setValue("building", "");
    setValue("asset", "");

    setValue("assetId", "");
    setValue("assetName", "");
    setValue("location", "");
  };

  /*
   * Building change
   */

  const handleBuildingChange = (value) => {
    setValue("building", value);

    setValue("asset", "");

    setValue("assetId", "");
    setValue("assetName", "");
    setValue("location", "");
  };

  /*
   * Asset selection
   */

  const handleAssetChange = (value) => {
    setValue("asset", value);

    const asset = ppmAssets.find(
      (item) => item.id === value
    );

    if (!asset) {
      setValue("assetId", "");
      setValue("assetName", "");
      setValue("location", "");
      setValue("qty", 1);

      return;
    }

    setValue("assetId", asset.assetId);
    setValue("assetName", asset.assetName);
    setValue("location", asset.location);
    setValue("qty", asset.qty);
  };

  /*
   * Save
   */

  const onSubmit = (data) => {
    console.log("PPM Scheduler:", data);

    // API call will be added here later.

    router.push("/admin/ppm/scheduler");
  };

  /*
   * Cancel
   */

  const handleCancel = () => {
    router.push("/admin/ppm/scheduler");
  };

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
    >
      <div className={styles.container}>

        {/* =========================
            TOP HEADER
        ========================== */}

         <PageHeader
                title="PPM Scheduler"
                subtitle="Manage your PPM schedules and tasks efficiently."
                
               
              />

        {/* <div className={styles.topHeader}>

          <div className={styles.titleSection}>

            <button
              type="button"
              className={styles.backButton}
              onClick={handleCancel}
            >
              <ArrowLeft size={18} />
            </button>

            <span className={styles.pageTitle}>
              PPM Scheduler
            </span>

          </div>

          <div className={styles.headerActions}>

            <Button
              variant="outlined"
              startIcon={<X size={15} />}
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={<Check size={16} />}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>

          </div>

        </div> */}

        {/* =========================
            BREADCRUMBS
        ========================== */}

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
                label: "PPM Scheduler",
              },
            ]}
          />

        </div>

        <form
          className={styles.form}
          onSubmit={handleSubmit(onSubmit)}
        >

          {/* =========================
              SELECT ASSET
          ========================== */}

          <section className={styles.section}>

            <div className={styles.sectionHeader}>
              Select Asset
            </div>

            <div className={styles.assetSectionBody}>

            <div className={styles.assetFields}>

              {/* Project */}

              <Controller
                name="project"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    required
                    error={Boolean(
                      errors.project
                    )}
                  >
                    <InputLabel>
                      Project
                    </InputLabel>

                    <Select
                      {...field}
                      label="Project"
                      onChange={(event) =>
                        handleProjectChange(
                          event.target.value
                        )
                      }
                    >
                      <MenuItem value="">
                        Select Project
                      </MenuItem>

                      {ppmProjects.map(
                        (project) => (
                          <MenuItem
                            key={project.id}
                            value={project.id}
                          >
                            {project.name}
                          </MenuItem>
                        )
                      )}
                    </Select>

                    <FormHelperText>
                      {errors.project?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              {/* Building */}

              <Controller
                name="building"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    required
                    disabled={!selectedProject}
                    error={Boolean(
                      errors.building
                    )}
                  >
                    <InputLabel>
                      Building
                    </InputLabel>

                    <Select
                      {...field}
                      label="Building"
                      onChange={(event) =>
                        handleBuildingChange(
                          event.target.value
                        )
                      }
                    >
                      <MenuItem value="">
                        Select Building
                      </MenuItem>

                      {filteredBuildings.map(
                        (building) => (
                          <MenuItem
                            key={building.id}
                            value={building.id}
                          >
                            {building.name}
                          </MenuItem>
                        )
                      )}
                    </Select>

                    <FormHelperText>
                      {errors.building?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              {/* Asset */}

              <Controller
                name="asset"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    required
                    disabled={!selectedBuilding}
                    error={Boolean(
                      errors.asset
                    )}
                  >
                    <InputLabel>
                      Asset
                    </InputLabel>

                    <Select
                      {...field}
                      label="Asset"
                      onChange={(event) =>
                        handleAssetChange(
                          event.target.value
                        )
                      }
                    >
                      <MenuItem value="">
                        Select Asset
                      </MenuItem>

                      {filteredAssets.map(
                        (asset) => (
                          <MenuItem
                            key={asset.id}
                            value={asset.id}
                          >
                            {asset.assetName}
                          </MenuItem>
                        )
                      )}
                    </Select>

                    <FormHelperText>
                      {errors.asset?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              {/* Asset ID */}

              <TextField
                label="Asset ID"
                size="small"
                fullWidth
                value={watch("assetId")}
                disabled
              />

              {/* Asset Name */}

              <TextField
                label="Asset Name"
                size="small"
                fullWidth
                value={watch("assetName")}
                disabled
              />

              {/* Location */}

              <TextField
                label="Location"
                size="small"
                fullWidth
                value={watch("location")}
                disabled
              />

              {/* Qty */}

              <TextField
                label="Qty"
                size="small"
                type="number"
                fullWidth
                {...register("qty", {
                  valueAsNumber: true,
                })}
                error={Boolean(errors.qty)}
                helperText={
                  errors.qty?.message
                }
              />

            </div>

            {/* Asset Image */}

            <aside
              className={styles.assetPreview}
              aria-label="Selected asset preview"
            >
              <div className={styles.assetImage}>
                {selectedAssetRecord?.image &&
                brokenImage !== selectedAssetRecord.image ? (
                  // Asset images are arbitrary (API/remote) URLs, so a plain
                  // <img> is used instead of next/image.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedAssetRecord.image}
                    alt={selectedAssetRecord.assetName}
                    onError={() =>
                      setBrokenImage(selectedAssetRecord.image)
                    }
                  />
                ) : (
                  <ImageOff
                    size={26}
                    strokeWidth={1.6}
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className={styles.assetDetails}>
                {selectedAssetRecord ? (
                  <>
                    <span className={styles.assetImageName}>
                      {selectedAssetRecord.assetName}
                    </span>
                    <span
                      className={styles.assetMeta}
                      title={selectedAssetRecord.assetId}
                    >
                      {selectedAssetRecord.assetId}
                    </span>
                    <span className={styles.assetMeta}>
                      {selectedAssetRecord.location}
                    </span>
                    {!selectedAssetRecord.image && (
                      <span className={styles.assetHint}>
                        No image available
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    <span className={styles.assetImageName}>
                      No asset selected
                    </span>
                    <span className={styles.assetHint}>
                      Choose a project, building and asset to preview it here.
                    </span>
                  </>
                )}
              </div>
            </aside>

            </div>

          </section>

          {/* =========================
              SET PPM
          ========================== */}

          <section className={styles.section}>

            <div className={styles.sectionHeader}>
              Set PPM
            </div>

            <div className={styles.sectionBody}>

              <TextField
                label="PPM Code"
                placeholder="#Ppm Code"
                size="small"
                fullWidth
                {...register("ppmCode")}
              />

              <Controller
                name="instructionSet"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    required
                    error={Boolean(
                      errors.instructionSet
                    )}
                  >
                    <InputLabel>
                      Instruction Set
                    </InputLabel>

                    <Select
                      {...field}
                      label="Instruction Set"
                    >
                      <MenuItem value="">
                        Select Instruction Set
                      </MenuItem>

                      {instructionSets.map(
                        (item) => (
                          <MenuItem
                            key={item}
                            value={item}
                          >
                            {item}
                          </MenuItem>
                        )
                      )}
                    </Select>

                    <FormHelperText>
                      {
                        errors.instructionSet
                          ?.message
                      }
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <TextField
                label="Family"
                size="small"
                fullWidth
                {...register("family")}
              />

              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    required
                    error={Boolean(
                      errors.priority
                    )}
                  >
                    <InputLabel>
                      Priority
                    </InputLabel>

                    <Select
                      {...field}
                      label="Priority"
                    >
                      <MenuItem value="">
                        Select Priority
                      </MenuItem>

                      {priorities.map(
                        (item) => (
                          <MenuItem
                            key={item}
                            value={item}
                          >
                            {item}
                          </MenuItem>
                        )
                      )}
                    </Select>

                    <FormHelperText>
                      {errors.priority?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <TextField
                label="Estimation Time"
                placeholder="Estimation Time"
                size="small"
                fullWidth
                {...register(
                  "estimationTime"
                )}
              />

              <TextField
                label="Estimation Men"
                placeholder="Estimation Men"
                size="small"
                fullWidth
                {...register("estimationMen")}
              />

              <TextField
                label="Stocklab Cost"
                placeholder="Stocklab Cost"
                size="small"
                fullWidth
                {...register("stocklabCost")}
              />

              <TextField
                label="Total Cost"
                placeholder="Total Cost"
                size="small"
                fullWidth
                {...register("totalCost")}
              />

              <Controller
                name="financeCode"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    required
                    error={Boolean(
                      errors.financeCode
                    )}
                  >
                    <InputLabel>
                      Finance Code
                    </InputLabel>

                    <Select
                      {...field}
                      label="Finance Code"
                    >
                      <MenuItem value="">
                        Select Finance Code
                      </MenuItem>

                      {financeCodes.map(
                        (item) => (
                          <MenuItem
                            key={item}
                            value={item}
                          >
                            {item}
                          </MenuItem>
                        )
                      )}
                    </Select>

                    <FormHelperText>
                      {
                        errors.financeCode
                          ?.message
                      }
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="costCenter"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    required
                    error={Boolean(
                      errors.costCenter
                    )}
                  >
                    <InputLabel>
                      Cost Center
                    </InputLabel>

                    <Select
                      {...field}
                      label="Cost Center"
                    >
                      <MenuItem value="">
                        Select Cost Center
                      </MenuItem>

                      {costCenters.map(
                        (item) => (
                          <MenuItem
                            key={item}
                            value={item}
                          >
                            {item}
                          </MenuItem>
                        )
                      )}
                    </Select>

                    <FormHelperText>
                      {
                        errors.costCenter
                          ?.message
                      }
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="costCode"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    required
                    error={Boolean(
                      errors.costCode
                    )}
                  >
                    <InputLabel>
                      Cost Code
                    </InputLabel>

                    <Select
                      {...field}
                      label="Cost Code"
                    >
                      <MenuItem value="">
                        Select Cost Code
                      </MenuItem>

                      {costCodes.map(
                        (item) => (
                          <MenuItem
                            key={item}
                            value={item}
                          >
                            {item}
                          </MenuItem>
                        )
                      )}
                    </Select>

                    <FormHelperText>
                      {
                        errors.costCode
                          ?.message
                      }
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <Controller
                name="resource"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    required
                    error={Boolean(
                      errors.resource
                    )}
                  >
                    <InputLabel>
                      Resource
                    </InputLabel>

                    <Select
                      {...field}
                      label="Resource"
                    >
                      <MenuItem value="">
                        Select Resource
                      </MenuItem>

                      {resources.map(
                        (item) => (
                          <MenuItem
                            key={item}
                            value={item}
                          >
                            {item}
                          </MenuItem>
                        )
                      )}
                    </Select>

                    <FormHelperText>
                      {errors.resource?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />

              <TextField
                label="Designation"
                size="small"
                fullWidth
                {...register("designation")}
              />

              <Controller
                name="shift"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                  >
                    <InputLabel>
                      Shift
                    </InputLabel>

                    <Select
                      {...field}
                      label="Shift"
                    >
                      <MenuItem value="">
                        Select Shift
                      </MenuItem>

                      {shifts.map(
                        (item) => (
                          <MenuItem
                            key={item}
                            value={item}
                          >
                            {item}
                          </MenuItem>
                        )
                      )}
                    </Select>
                  </FormControl>
                )}
              />

              <div className={styles.checkboxGroup}>

                <Controller
                  name="permitRequired"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={(
                            event
                          ) =>
                            field.onChange(
                              event.target.checked
                            )
                          }
                          size="small"
                        />
                      }
                      label="Do you need permit?"
                    />
                  )}
                />

                <Controller
                  name="healthSafety"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={(
                            event
                          ) =>
                            field.onChange(
                              event.target.checked
                            )
                          }
                          size="small"
                        />
                      }
                      label="Health and Safety"
                    />
                  )}
                />

              </div>

            </div>

          </section>

          {/* =========================
              SERVICE DETAILS
          ========================== */}

          <section className={styles.section}>

            <div className={styles.sectionHeader}>
              Service Details
            </div>

            <div className={styles.sectionBody}>

              {/* Last Service */}

              <Controller
                name="lastService"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Last Service"
                    value={
                      field.value
                        ? dayjs(field.value)
                        : null
                    }
                    onChange={(date) => {
                      const value = date
                        ? date.format(
                            "YYYY-MM-DD"
                          )
                        : "";

                      field.onChange(value);

                      updateNextDue(
                        value,
                        serviceFrequency,
                        frequencyType
                      );
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        required: true,
                        error: Boolean(
                          errors.lastService
                        ),
                        helperText:
                          errors.lastService
                            ?.message,
                      },
                    }}
                  />
                )}
              />

              {/* Frequency */}

              <TextField
                label="Service Frequency"
                size="small"
                type="number"
                fullWidth
                required
                {...register(
                  "serviceFrequency"
                )}
                error={Boolean(
                  errors.serviceFrequency
                )}
                helperText={
                  errors.serviceFrequency
                    ?.message
                }
                onChange={(event) => {
                  const value =
                    event.target.value;

                  setValue(
                    "serviceFrequency",
                    value
                  );

                  updateNextDue(
                    watch("lastService"),
                    value,
                    watch("frequencyType")
                  );
                }}
              />

              {/* Frequency Type */}

              <Controller
                name="frequencyType"
                control={control}
                render={({ field }) => (
                  <FormControl
                    fullWidth
                    size="small"
                    required
                    error={Boolean(
                      errors.frequencyType
                    )}
                  >
                    <InputLabel>
                      Frequency Type
                    </InputLabel>

                    <Select
                      {...field}
                      label="Frequency Type"
                      onChange={(event) => {
                        const value =
                          event.target.value;

                        field.onChange(value);

                        updateNextDue(
                          watch("lastService"),
                          serviceFrequency,
                          value
                        );
                      }}
                    >
                      <MenuItem value="">
                        Select Frequency Type
                      </MenuItem>

                      {frequencyTypes.map(
                        (item) => (
                          <MenuItem
                            key={item}
                            value={item}
                          >
                            {item}
                          </MenuItem>
                        )
                      )}
                    </Select>

                    <FormHelperText>
                      {
                        errors.frequencyType
                          ?.message
                      }
                    </FormHelperText>
                  </FormControl>
                )}
              />

              {/* Next Due */}

              <Controller
                name="nextDue"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Next Due"
                    value={
                      field.value
                        ? dayjs(field.value)
                        : null
                    }
                    onChange={(date) => {
                      field.onChange(
                        date
                          ? date.format(
                              "YYYY-MM-DD"
                            )
                          : ""
                      );
                    }}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        required: true,
                        error: Boolean(
                          errors.nextDue
                        ),
                        helperText:
                          errors.nextDue
                            ?.message,
                      },
                    }}
                  />
                )}
              />

              {/* Week */}

              <TextField
                label="Week"
                size="small"
                fullWidth
                {...register("week")}
              />

            </div>

          </section>

          <div className={styles.saveAndButton}>

            <Button
              variant="outlined"
              startIcon={<X size={15} />}
              onClick={handleCancel}
              className={styles.cancelButton}
            >
              Cancel
            </Button>

            <Button
              variant="contained"
              startIcon={<Check size={16} />}
              onClick={handleSubmit(onSubmit)}
            >
              Save
            </Button>

          </div>

        </form>
      </div>
    </LocalizationProvider>
  );
}