"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Button,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
} from "@mui/material";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { Check, ImagePlus, Settings, X } from "lucide-react";

import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import FormSelect from "../createPPM/FormSelect";
import FormDatePicker from "../createPPM/FormDatePicker";

import {
  projectStatuses,
  accountProfiles,
  projectTypes,
  countries,
  states,
  cities,
  masterDevelopments,
  zones,
  pmAutoIssuanceOptions,
  developers,
} from "../../data/projectOptions";

import { projectSchema } from "../../schemas/projectSchema";

import styles from "./Project.module.css";

const PROJECTS_PATH = "/admin/core/administration/projects";

const tabs = [
  { value: "general", label: "General" },
  { value: "project", label: "Project" },
  { value: "images", label: "Images" },
];

const MAX_IMAGE_SIZE_MB = 5;

const projectTabFields = [
  "start_date",
  "end_date",
  "review_date",
  "is_overridden_workorder",
  "pm_auto_issuance",
  "frequency",
  "builtup_area_sqft",
  "builtup_area_sqm",
  "plot_area_sqft",
  "plot_area_sqm",
  "developed_by",
  "comment",
];

const numberFields = [
  "project_value",
  "frequency",
  "builtup_area_sqft",
  "builtup_area_sqm",
  "plot_area_sqft",
  "plot_area_sqm",
];

const areaInputProps = {
  type: "number",
  slotProps: { htmlInput: { min: 0, step: "0.01" } },
};

const defaultValues = {
  status: "",
  account_profile: "",
  community_code: "",
  community_title: "",
  main_reference_no: "",
  project_type: "",
  project_alias: "",

  country: "",
  state: "",
  city: "",
  master_development: "",
  zone: "",
  street_no: "",
  street_name: "",
  po_box: "",

  project_value: "",

  start_date: "",
  end_date: "",
  review_date: "",
  is_overridden_workorder: false,
  pm_auto_issuance: "",
  frequency: "",

  builtup_area_sqft: "",
  builtup_area_sqm: "",
  plot_area_sqft: "",
  plot_area_sqm: "",
  developed_by: "",
  comment: "",
};

/*
 * Add Project page.
 * Fields are split across the General and Project tabs.
 */
export default function Project() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("general");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const [selectedCountry, selectedState, selectedMasterDevelopment] = useWatch(
    {
      control,
      name: ["country", "state", "master_development"],
    }
  );

  /*
   * Dependent dropdowns: Country -> State -> City, Master Development -> Zone
   */

  const filteredStates = useMemo(
    () => states.filter((state) => state.countryId === selectedCountry),
    [selectedCountry]
  );

  const filteredCities = useMemo(
    () => cities.filter((city) => city.stateId === selectedState),
    [selectedState]
  );

  const filteredZones = useMemo(
    () =>
      zones.filter(
        (zone) => zone.masterDevelopmentId === selectedMasterDevelopment
      ),
    [selectedMasterDevelopment]
  );

  const handleCountryChange = () => {
    setValue("state", "");
    setValue("city", "");
  };

  const handleStateChange = () => {
    setValue("city", "");
  };

  const handleMasterDevelopmentChange = () => {
    setValue("zone", "");
  };

  /*
   * Images
   */

  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState("");

  const imagesRef = useRef(images);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // Release the preview URLs when leaving the page.
  useEffect(
    () => () => {
      imagesRef.current.forEach((image) => URL.revokeObjectURL(image.url));
    },
    []
  );

  const handleImagesSelect = (event) => {
    const files = Array.from(event.target.files ?? []);

    // Allow picking the same file again after it has been removed.
    event.target.value = "";

    const validFiles = files.filter(
      (file) =>
        file.type.startsWith("image/") &&
        file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024
    );

    setImageError(
      validFiles.length < files.length
        ? `Only image files up to ${MAX_IMAGE_SIZE_MB} MB are allowed`
        : ""
    );

    setImages((current) => [
      ...current,
      ...validFiles.map((file) => ({
        id: crypto.randomUUID(),
        file,
        url: URL.createObjectURL(file),
      })),
    ]);
  };

  const handleImageRemove = (image) => {
    URL.revokeObjectURL(image.url);

    setImages((current) => current.filter((item) => item.id !== image.id));
  };

  /*
   * Save
   */

  const onSubmit = async (project) => {
    const numbers = Object.fromEntries(
      numberFields.map((name) => [
        name,
        project[name] === "" ? null : Number(project[name]),
      ])
    );

    console.log("Project:", {
      ...project,
      ...numbers,
      images: images.map((image) => image.file),
    });

    // API call will be added here later.

    router.push(PROJECTS_PATH);
  };

  // Bring the tab holding the first failed field into view so the user can
  // see what failed validation.
  const onInvalid = (formErrors) => {
    const hasGeneralError = Object.keys(formErrors).some(
      (name) => !projectTabFields.includes(name)
    );

    setActiveTab(hasGeneralError ? "general" : "project");
  };

  const handleCancel = () => {
    router.push(PROJECTS_PATH);
  };

  const fieldProps = (name) => ({
    fullWidth: true,
    size: "small",
    ...register(name),
    error: Boolean(errors[name]),
    helperText: errors[name]?.message,
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <div className={styles.container}>
      <PageHeader title="Add Project" subtitle="Create a new project" />

      <Breadcrumbs
        items={[
          {
            label: "Core",
            icon: <Settings size={18} />,
          },
          {
            label: "Administration",
          },
          {
            label: "Projects",
            href: PROJECTS_PATH,
          },
          {
            label: "Add Project",
          },
        ]}
      />

      <form
        className={styles.form}
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        noValidate
      >
        <div className={styles.tabsWrapper}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => setActiveTab(value)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabs.map((tab) => (
              <Tab key={tab.value} value={tab.value} label={tab.label} />
            ))}
          </Tabs>
        </div>

        {/* =========================
            GENERAL TAB
        ========================== */}

        <div hidden={activeTab !== "general"} className={styles.tabPanel}>
          {/* General Info */}

          <section className={styles.section}>
            <div className={styles.sectionHeader}>General Info</div>

            <div className={styles.sectionBody}>
              {/* Generated by the backend on save */}
              <TextField
                label="Ref No"
                value=""
                placeholder="Auto generated"
                fullWidth
                size="small"
                slotProps={{
                  input: { readOnly: true },
                  inputLabel: { shrink: true },
                }}
              />

              <FormSelect
                name="status"
                control={control}
                label="Status"
                options={projectStatuses}
                required
                error={errors.status}
              />

              <FormSelect
                name="account_profile"
                control={control}
                label="Account Profile"
                options={accountProfiles}
                required
                error={errors.account_profile}
              />

              <TextField
                label="Community Code"
                required
                {...fieldProps("community_code")}
              />

              <TextField
                label="Community Title"
                required
                {...fieldProps("community_title")}
              />

              <TextField
                label="Main Ref No"
                {...fieldProps("main_reference_no")}
              />

              <FormSelect
                name="project_type"
                control={control}
                label="Project Type"
                options={projectTypes}
                required
                error={errors.project_type}
              />

              <TextField
                label="Project Alias"
                {...fieldProps("project_alias")}
              />
            </div>
          </section>

          {/* Address */}

          <section className={styles.section}>
            <div className={styles.sectionHeader}>Address</div>

            <div className={styles.sectionBody}>
              <FormSelect
                name="country"
                control={control}
                label="Country"
                options={countries}
                required
                error={errors.country}
                onChange={handleCountryChange}
              />

              <FormSelect
                name="state"
                control={control}
                label="State"
                options={filteredStates}
                required
                disabled={!selectedCountry}
                error={errors.state}
                onChange={handleStateChange}
              />

              <FormSelect
                name="city"
                control={control}
                label="City"
                options={filteredCities}
                required
                disabled={!selectedState}
                error={errors.city}
              />

              <FormSelect
                name="master_development"
                control={control}
                label="Master Development"
                options={masterDevelopments}
                error={errors.master_development}
                onChange={handleMasterDevelopmentChange}
              />

              <FormSelect
                name="zone"
                control={control}
                label="Zone"
                options={filteredZones}
                disabled={!selectedMasterDevelopment}
                error={errors.zone}
              />

              <TextField label="Street No" {...fieldProps("street_no")} />

              <TextField label="Street Name" {...fieldProps("street_name")} />

              <TextField label="PO Box" {...fieldProps("po_box")} />
            </div>
          </section>

          {/* Finance */}

          <section className={styles.section}>
            <div className={styles.sectionHeader}>Finance</div>

            <div className={styles.sectionBody}>
              <TextField
                label="Project Value"
                type="number"
                slotProps={{
                  htmlInput: { min: 0, step: "0.01" },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">AED</InputAdornment>
                    ),
                  },
                }}
                {...fieldProps("project_value")}
              />
            </div>
          </section>
        </div>

        {/* =========================
            PROJECT TAB
        ========================== */}

        <div hidden={activeTab !== "project"} className={styles.tabPanel}>
          {/* Contract Details */}

          <section className={styles.section}>
            <div className={styles.sectionHeader}>Contract Details</div>

            <div className={styles.sectionBody}>
              <FormDatePicker
                name="start_date"
                control={control}
                label="Start Date"
                error={errors.start_date}
              />

              <FormDatePicker
                name="end_date"
                control={control}
                label="End Date"
                error={errors.end_date}
              />

              <FormDatePicker
                name="review_date"
                control={control}
                label="Review Date"
                error={errors.review_date}
              />

              <Controller
                name="is_overridden_workorder"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(event) =>
                          field.onChange(event.target.checked)
                        }
                        size="small"
                      />
                    }
                    label="Is Overridden Workorder"
                  />
                )}
              />

              <FormSelect
                name="pm_auto_issuance"
                control={control}
                label="PM Auto Issuance"
                options={pmAutoIssuanceOptions}
                error={errors.pm_auto_issuance}
              />

              <TextField
                label="Frequency"
                type="number"
                slotProps={{ htmlInput: { min: 1, step: 1 } }}
                {...fieldProps("frequency")}
              />
            </div>
          </section>

          {/* Dimensions */}

          <section className={styles.section}>
            <div className={styles.sectionHeader}>Dimensions</div>

            <div className={styles.sectionBody}>
              <TextField
                label="Builtup Area (Sq.Ft)"
                {...areaInputProps}
                {...fieldProps("builtup_area_sqft")}
              />

              <TextField
                label="Builtup Area (Sq.M)"
                {...areaInputProps}
                {...fieldProps("builtup_area_sqm")}
              />

              <TextField
                label="Plot Area (Sq.Ft)"
                {...areaInputProps}
                {...fieldProps("plot_area_sqft")}
              />

              <TextField
                label="Plot Area (Sq.M)"
                {...areaInputProps}
                {...fieldProps("plot_area_sqm")}
              />

              <FormSelect
                name="developed_by"
                control={control}
                label="Developed By"
                options={developers}
                error={errors.developed_by}
              />

              <TextField
                label="Comment"
                multiline
                minRows={3}
                className={styles.fullWidth}
                {...fieldProps("comment")}
              />
            </div>
          </section>
        </div>

        {/* =========================
            IMAGES TAB
        ========================== */}

        <div hidden={activeTab !== "images"} className={styles.tabPanel}>
          <section className={styles.section}>
            <div className={styles.sectionHeader}>Images</div>

            <div className={styles.imagesBody}>
              <label className={styles.uploadBox}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImagesSelect}
                />

                <ImagePlus size={28} />

                <span className={styles.uploadTitle}>
                  Click to upload images
                </span>

                <span className={styles.uploadHint}>
                  PNG, JPG or WEBP up to {MAX_IMAGE_SIZE_MB} MB each
                </span>
              </label>

              {imageError && (
                <div className={styles.uploadError}>{imageError}</div>
              )}

              {images.length > 0 && (
                <div className={styles.imageGrid}>
                  {images.map((image) => (
                    <div key={image.id} className={styles.imageCard}>
                      <div
                        role="img"
                        aria-label={image.file.name}
                        className={styles.imagePreview}
                        style={{ backgroundImage: `url(${image.url})` }}
                      />

                      <button
                        type="button"
                        className={styles.imageRemove}
                        aria-label={`Remove ${image.file.name}`}
                        onClick={() => handleImageRemove(image)}
                      >
                        <X size={14} />
                      </button>

                      <div className={styles.imageName} title={image.file.name}>
                        {image.file.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        <div className={styles.saveAndButton}>
          <Button
            variant="outlined"
            startIcon={<X size={15} />}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            startIcon={<Check size={16} />}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </div>
    </LocalizationProvider>
  );
}
