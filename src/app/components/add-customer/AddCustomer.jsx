"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Avatar,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  MenuItem,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { DeleteOutlined, VisibilityOutlined } from "@mui/icons-material";
import dayjs from "dayjs";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import {
  Camera,
  Check,
  FileText,
  Files,
  KeyRound,
  Paperclip,
  Plus,
  Settings,
  Upload,
  Star,
  User,
  X,
} from "lucide-react";

import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import FormSelect from "../createPPM/FormSelect";
import FormDatePicker from "../createPPM/FormDatePicker";

import {
  customerStatuses,
  customerTypes,
  customerCategories,
  nationalities,
  genders,
  dialCodes,
  relationships,
  countries,
  states,
  cities,
  masterDevelopments,
  buildings,
  floors,
  documentTypes,
} from "../../data/customerOptions";

import {
  customerSchema,
  customerUnitSchema,
  customerDocumentSchema,
} from "../../schemas/customerSchema";

import styles from "./AddCustomer.module.css";

const CUSTOMERS_PATH = "/admin/core/user-management/customers";

const MAX_PHOTO_SIZE_MB = 2;

const MAX_DOCUMENT_SIZE_MB = 10;

const DOCUMENT_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".doc", ".docx"];

const isAllowedDocument = (file) =>
  DOCUMENT_EXTENSIONS.some((extension) =>
    file.name.toLowerCase().endsWith(extension),
  );

const formatFileSize = (bytes) =>
  bytes < 1024 * 1024
    ? `${Math.max(1, Math.round(bytes / 1024))} KB`
    : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

const tabs = [
  { value: "general", label: "General", icon: <User size={16} /> },
  { value: "property", label: "Property Info", icon: <FileText size={16} /> },
  { value: "documents", label: "Documents", icon: <Files size={16} /> },
  {
    value: "authentication",
    label: "Authentication",
    icon: <KeyRound size={16} />,
  },
];

const defaultValues = {
  is_vip: false,
  status: "New",

  customer_type: "owner",
  customer_category: "corporate",

  first_name: "",
  middle_name: "",
  last_name: "",
  dob: "",
  nationality: "",
  national_id_no: "",
  passport_no: "",
  gender: "",

  country: "",
  state: "",
  city: "",
  street_no: "",
  street_name: "",
  land_mark: "",
  po_box: "",

  mobile_code: "+971",
  mobile_no: "",
  email: "",
  land_code: "+971",
  land_no: "",
  fax_code: "+971",
  fax: "",

  emergency_name: "",
  emergency_last_name: "",
  emergency_relationship: "",
  emergency_mobile_code: "+971",
  emergency_mobile_no: "",
  emergency_email: "",
};

const unitDefaultValues = {
  master_development: "",
  building: "",
  floor: "",
  unit: "",
  owner_occupied: false,
};

const documentDefaultValues = {
  document_type: "",
  document_no: "",
  expiry_date: "",
};

const labelOf = (options, value) =>
  options.find((option) => option.value === value)?.label ?? value;

/*
 * Single-choice chip group (Customer Type, Customer Category).
 */
function ChipSelect({ name, control, label, options, required, error }) {
  return (
    <div className={styles.chipField}>
      <span className={styles.chipLabel}>
        {label}
        {required && <span className={styles.required}> *</span>}
      </span>

      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <div
            className={styles.chipGroup}
            role="radiogroup"
            aria-label={label}
          >
            {options.map((option) => {
              const selected = field.value === option.value;

              return (
                <Chip
                  key={option.value}
                  label={option.label}
                  role="radio"
                  aria-checked={selected}
                  color={selected ? "primary" : "default"}
                  variant={selected ? "filled" : "outlined"}
                  onClick={() => field.onChange(option.value)}
                />
              );
            })}
          </div>
        )}
      />

      {error && <span className={styles.chipError}>{error.message}</span>}
    </div>
  );
}

/*
 * Country code dropdown + number input (Mobile No, Land No, Fax).
 * `fieldProps` comes from the parent so the number uses the same
 * register / error wiring as the other text fields.
 */
function PhoneField({
  codeName,
  control,
  label,
  required,
  numberProps,
  className,
}) {
  return (
    <div className={`${styles.phoneField} ${className ?? ""}`}>
      <Controller
        name={codeName}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            select
            size="small"
            label="Code"
            aria-label={`${label} country code`}
            className={styles.dialCode}
          >
            {dialCodes.map((code) => (
              <MenuItem key={code.value} value={code.value}>
                {code.label}
              </MenuItem>
            ))}
          </TextField>
        )}
      />

      <TextField
        label={label}
        required={required}
        type="tel"
        {...numberProps}
      />
    </div>
  );
}

/*
 * Add Customer page.
 * Only the General tab is built so far; the other tabs are placeholders.
 */
export default function AddCustomer() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("general");

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(customerSchema),
    defaultValues,
    mode: "onSubmit",
  });

  const [selectedCountry, selectedState] = useWatch({
    control,
    name: ["country", "state"],
  });

  /*
   * Dependent dropdowns: Country -> State -> City
   */

  const filteredStates = useMemo(
    () => states.filter((state) => state.countryId === selectedCountry),
    [selectedCountry],
  );

  const filteredCities = useMemo(
    () => cities.filter((city) => city.stateId === selectedState),
    [selectedState],
  );

  const handleCountryChange = () => {
    setValue("state", "");
    setValue("city", "");
  };

  const handleStateChange = () => {
    setValue("city", "");
  };

  /*
   * Profile photo
   */

  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState("");

  const photoRef = useRef(photo);

  useEffect(() => {
    photoRef.current = photo;
  }, [photo]);

  // Release the preview URL when leaving the page.
  useEffect(
    () => () => {
      if (photoRef.current) URL.revokeObjectURL(photoRef.current.url);
    },
    [],
  );

  const handlePhotoSelect = (event) => {
    const file = event.target.files?.[0];

    // Allow picking the same file again after it has been removed.
    event.target.value = "";

    if (!file) return;

    if (
      !file.type.startsWith("image/") ||
      file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024
    ) {
      setPhotoError(
        `Only image files up to ${MAX_PHOTO_SIZE_MB} MB are allowed`,
      );
      return;
    }

    setPhotoError("");

    setPhoto((current) => {
      if (current) URL.revokeObjectURL(current.url);

      return { file, url: URL.createObjectURL(file) };
    });
  };

  const handlePhotoRemove = () => {
    if (photo) URL.revokeObjectURL(photo.url);

    setPhoto(null);
  };

  /*
   * Property Info: units are picked with their own small form and collected
   * in `units`, which is sent along with the customer on Save.
   */

  const [units, setUnits] = useState([]);

  const {
    control: unitControl,
    register: unitRegister,
    handleSubmit: handleUnitSubmit,
    setValue: setUnitValue,
    setError: setUnitError,
    formState: { errors: unitErrors },
  } = useForm({
    resolver: zodResolver(customerUnitSchema),
    defaultValues: unitDefaultValues,
    mode: "onSubmit",
  });

  const [selectedMasterDevelopment, selectedBuilding] = useWatch({
    control: unitControl,
    name: ["master_development", "building"],
  });

  const filteredBuildings = useMemo(
    () =>
      buildings.filter(
        (building) =>
          building.masterDevelopmentId === selectedMasterDevelopment,
      ),
    [selectedMasterDevelopment],
  );

  const filteredFloors = useMemo(
    () => floors.filter((floor) => floor.buildingId === selectedBuilding),
    [selectedBuilding],
  );

  const handleMasterDevelopmentChange = () => {
    setUnitValue("building", "");
    setUnitValue("floor", "");
  };

  const handleBuildingChange = () => {
    setUnitValue("floor", "");
  };

  const handleAddUnit = (unit) => {
    const unitNo = unit.unit.trim();

    const exists = units.some(
      (row) =>
        row.floor === unit.floor &&
        row.unit.toLowerCase() === unitNo.toLowerCase(),
    );

    if (exists) {
      setUnitError("unit", {
        message: "This unit is already added",
      });
      return;
    }

    setUnits((current) => [
      ...current,
      {
        ...unit,
        id: crypto.randomUUID(),
        unit: unitNo,
        masterDevelopmentName: labelOf(
          masterDevelopments,
          unit.master_development,
        ),
        buildingName: labelOf(buildings, unit.building),
        floorName: labelOf(floors, unit.floor),
      },
    ]);

    // Keep Master Development / Building / Floor so several units on the
    // same floor can be added in a row.
    setUnitValue("unit", "");
    setUnitValue("owner_occupied", false);
  };

  const handleRemoveUnit = (id) => {
    setUnits((current) => current.filter((row) => row.id !== id));
  };

  const addUnit = handleUnitSubmit(handleAddUnit);

  const unitColumns = [
    {
      field: "masterDevelopmentName",
      headerName: "Master Development",
      flex: 1,
      minWidth: 170,
    },
    { field: "buildingName", headerName: "Building", flex: 1, minWidth: 170 },
    { field: "floorName", headerName: "Floor", flex: 0.6, minWidth: 100 },
    { field: "unit", headerName: "Unit", flex: 0.6, minWidth: 100 },
    {
      field: "owner_occupied",
      headerName: "Owner Occupied",
      flex: 0.6,
      minWidth: 140,
      valueFormatter: (value) => (value ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 90,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className={styles.rowActions}>
          <Tooltip title="Remove">
            <IconButton
              size="small"
              color="error"
              aria-label={`Remove unit ${params.row.unit}`}
              onClick={() => handleRemoveUnit(params.row.id)}
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  /*
   * Documents: details + file are picked with their own small form and
   * collected in `documents`, which is sent along with the customer on Save.
   */

  const [documents, setDocuments] = useState([]);
  const [documentFile, setDocumentFile] = useState(null);
  const [documentFileError, setDocumentFileError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const documentsRef = useRef(documents);

  useEffect(() => {
    documentsRef.current = documents;
  }, [documents]);

  // Release the preview URLs when leaving the page.
  useEffect(
    () => () => {
      documentsRef.current.forEach((document) =>
        URL.revokeObjectURL(document.url),
      );
    },
    [],
  );

  const {
    control: documentControl,
    register: documentRegister,
    handleSubmit: handleDocumentSubmit,
    reset: resetDocumentForm,
    formState: { errors: documentErrors },
  } = useForm({
    resolver: zodResolver(customerDocumentSchema),
    defaultValues: documentDefaultValues,
    mode: "onSubmit",
  });

  const pickDocumentFile = (file) => {
    if (!file) return;

    if (!isAllowedDocument(file)) {
      setDocumentFileError(
        `Only ${DOCUMENT_EXTENSIONS.join(", ")} files are allowed`,
      );
      return;
    }

    if (file.size > MAX_DOCUMENT_SIZE_MB * 1024 * 1024) {
      setDocumentFileError(
        `File must be ${MAX_DOCUMENT_SIZE_MB} MB or smaller`,
      );
      return;
    }

    setDocumentFileError("");
    setDocumentFile(file);
  };

  const handleDocumentFileSelect = (event) => {
    pickDocumentFile(event.target.files?.[0]);

    // Allow picking the same file again after it has been removed.
    event.target.value = "";
  };

  const handleDocumentDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    pickDocumentFile(event.dataTransfer.files?.[0]);
  };

  const handleAddDocument = (details) => {
    if (!documentFile) {
      setDocumentFileError("Please choose a file to upload");
      return;
    }

    setDocuments((current) => [
      ...current,
      {
        ...details,
        id: crypto.randomUUID(),
        file: documentFile,
        url: URL.createObjectURL(documentFile),
        documentTypeName: labelOf(documentTypes, details.document_type),
      },
    ]);

    resetDocumentForm(documentDefaultValues);
    setDocumentFile(null);
    setDocumentFileError("");
  };

  // The file is checked too when the details fail validation, so both
  // errors show at once.
  const addDocument = handleDocumentSubmit(handleAddDocument, () => {
    if (!documentFile) setDocumentFileError("Please choose a file to upload");
  });

  const handleRemoveDocument = (document) => {
    URL.revokeObjectURL(document.url);

    setDocuments((current) =>
      current.filter((item) => item.id !== document.id),
    );
  };

  const documentColumns = [
    {
      field: "documentTypeName",
      headerName: "Document Type",
      flex: 1,
      minWidth: 170,
    },
    {
      field: "document_no",
      headerName: "Document No",
      flex: 0.8,
      minWidth: 140,
      valueFormatter: (value) => value || "—",
    },
    {
      field: "expiry_date",
      headerName: "Expiry Date",
      flex: 0.7,
      minWidth: 120,
      valueFormatter: (value) =>
        value ? dayjs(value).format("DD MMM YYYY") : "—",
    },
    {
      field: "fileName",
      headerName: "File",
      flex: 1.2,
      minWidth: 200,
      valueGetter: (_, row) => row.file.name,
    },
    {
      field: "fileSize",
      headerName: "Size",
      width: 90,
      valueGetter: (_, row) => row.file.size,
      valueFormatter: (value) => formatFileSize(value),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className={styles.rowActions}>
          <Tooltip title="View">
            <IconButton
              size="small"
              color="primary"
              aria-label={`View ${params.row.file.name}`}
              component="a"
              href={params.row.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <VisibilityOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Remove">
            <IconButton
              size="small"
              color="error"
              aria-label={`Remove ${params.row.file.name}`}
              onClick={() => handleRemoveDocument(params.row)}
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  /*
   * Save
   */

  const onSubmit = async (customer) => {
    console.log("Customer:", {
      ...customer,
      units: units.map(
        ({ master_development, building, floor, unit, owner_occupied }) => ({
          master_development,
          building,
          floor,
          unit,
          owner_occupied,
        }),
      ),
      documents: documents.map(
        ({ document_type, document_no, expiry_date, file }) => ({
          document_type,
          document_no,
          expiry_date,
          file,
        }),
      ),
      photo: photo?.file ?? null,
    });

    // API call will be added here later.

    router.push(CUSTOMERS_PATH);
  };

  // Every field lives on the General tab for now, so bring it into view
  // when validation fails from another tab.
  const onInvalid = () => {
    setActiveTab("general");
  };

  const handleCancel = () => {
    router.push(CUSTOMERS_PATH);
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
        <PageHeader title="Add Customer" subtitle="Create a new customer" />

        <Breadcrumbs
          items={[
            {
              label: "Core",
              icon: <Settings size={18} />,
            },
            {
              label: "User Management",
            },
            {
              label: "Customers",
              href: CUSTOMERS_PATH,
            },
            {
              label: "Add Customer",
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
                <Tab
                  key={tab.value}
                  value={tab.value}
                  label={tab.label}
                  icon={tab.icon}
                  iconPosition="start"
                />
              ))}
            </Tabs>
          </div>

          {/* =========================
              GENERAL TAB
          ========================== */}

          <div hidden={activeTab !== "general"} className={styles.tabPanel}>
            <div className={styles.generalLayout}>
              {/* Left column: profile + status */}

              <div className={styles.column}>
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    General
                    <Controller
                      name="is_vip"
                      control={control}
                      render={({ field }) => (
                        <button
                          type="button"
                          className={`${styles.vipButton} ${
                            field.value ? styles.vipActive : ""
                          }`}
                          aria-pressed={field.value}
                          onClick={() => field.onChange(!field.value)}
                        >
                          <Star
                            size={14}
                            fill={field.value ? "currentColor" : "none"}
                          />
                          VIP
                        </button>
                      )}
                    />
                  </div>

                  <div className={styles.profileBody}>
                    <label className={styles.avatarUpload} title="Upload photo">
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handlePhotoSelect}
                      />

                      <Avatar
                        src={photo?.url}
                        alt="Customer photo"
                        className={styles.avatar}
                      >
                        <User size={56} />
                      </Avatar>

                      <span className={styles.avatarOverlay}>
                        <Camera size={15} />
                      </span>
                    </label>

                    {photo && (
                      <Button
                        size="small"
                        color="error"
                        onClick={handlePhotoRemove}
                      >
                        Remove photo
                      </Button>
                    )}

                    {photoError && (
                      <div className={styles.uploadError}>{photoError}</div>
                    )}

                    <div className={styles.customerId}>
                      Cust Id : <strong>--New--</strong>
                    </div>
                  </div>
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>Status</div>

                  <div className={styles.sectionBody}>
                    <FormSelect
                      name="status"
                      control={control}
                      label="Status"
                      options={customerStatuses}
                      required
                      error={errors.status}
                    />
                  </div>
                </section>
              </div>

              {/* Right column: form sections */}

              <div className={styles.column}>
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    General information
                  </div>

                  <div className={styles.sectionBody}>
                    <ChipSelect
                      name="customer_type"
                      control={control}
                      label="Customer Type"
                      options={customerTypes}
                      required
                      error={errors.customer_type}
                    />

                    <ChipSelect
                      name="customer_category"
                      control={control}
                      label="Customer Category"
                      options={customerCategories}
                      required
                      error={errors.customer_category}
                    />
                  </div>
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    Profile information
                  </div>

                  <div className={`${styles.sectionBody} ${styles.fieldGrid}`}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Customer Id"
                      value="--New--"
                      disabled
                      helperText="Generated on save"
                      className={styles.span3}
                    />

                    <TextField
                      label="First Name"
                      required
                      className={styles.span3}
                      {...fieldProps("first_name")}
                    />

                    <TextField
                      label="Middle Name"
                      className={styles.span3}
                      {...fieldProps("middle_name")}
                    />

                    <TextField
                      label="Last Name"
                      required
                      className={styles.span3}
                      {...fieldProps("last_name")}
                    />

                    <div className={styles.span4}>
                      <FormDatePicker
                        name="dob"
                        control={control}
                        label="DOB"
                        required
                        error={errors.dob}
                      />
                    </div>

                    <div className={styles.span4}>
                      <FormSelect
                        name="nationality"
                        control={control}
                        label="Nationality"
                        options={nationalities}
                        required
                        error={errors.nationality}
                      />
                    </div>

                    <TextField
                      label="National Id No"
                      className={styles.span4}
                      {...fieldProps("national_id_no")}
                    />

                    <TextField
                      label="Passport No"
                      className={styles.span4}
                      {...fieldProps("passport_no")}
                    />

                    <div className={styles.span4}>
                      <FormSelect
                        name="gender"
                        control={control}
                        label="Gender"
                        options={genders}
                        required
                        error={errors.gender}
                      />
                    </div>

                    {/* Address */}

                    <div className={styles.subsectionTitle}>Address</div>

                    <div className={styles.span6}>
                      <FormSelect
                        name="country"
                        control={control}
                        label="Country"
                        options={countries}
                        required
                        error={errors.country}
                        onChange={handleCountryChange}
                      />
                    </div>

                    <div className={styles.span6}>
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
                    </div>

                    <div className={styles.span6}>
                      <FormSelect
                        name="city"
                        control={control}
                        label="City"
                        options={filteredCities}
                        required
                        disabled={!selectedState}
                        error={errors.city}
                      />
                    </div>

                    <TextField
                      label="Street No"
                      className={styles.span6}
                      {...fieldProps("street_no")}
                    />

                    <TextField
                      label="Street Name"
                      className={styles.span4}
                      {...fieldProps("street_name")}
                    />

                    <TextField
                      label="Land Mark"
                      className={styles.span4}
                      {...fieldProps("land_mark")}
                    />

                    <TextField
                      label="PO Box / Zip Code"
                      className={styles.span4}
                      {...fieldProps("po_box")}
                    />
                  </div>
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>
                    Contact Information
                  </div>

                  <div className={`${styles.sectionBody} ${styles.fieldGrid}`}>
                    <PhoneField
                      codeName="mobile_code"
                      control={control}
                      label="Mobile No"
                      required
                      numberProps={fieldProps("mobile_no")}
                      className={styles.span6}
                    />

                    <TextField
                      label="Email Address"
                      type="email"
                      required
                      className={styles.span6}
                      {...fieldProps("email")}
                    />

                    <PhoneField
                      codeName="land_code"
                      control={control}
                      label="Land No"
                      required
                      numberProps={fieldProps("land_no")}
                      className={styles.span6}
                    />

                    <PhoneField
                      codeName="fax_code"
                      control={control}
                      label="Fax"
                      required
                      numberProps={fieldProps("fax")}
                      className={styles.span6}
                    />
                  </div>
                </section>

                <section className={styles.section}>
                  <div className={styles.sectionHeader}>Emergency Contact</div>

                  <div className={`${styles.sectionBody} ${styles.fieldGrid}`}>
                    <TextField
                      label="Name"
                      className={styles.span4}
                      {...fieldProps("emergency_name")}
                    />

                    <TextField
                      label="Last Name"
                      className={styles.span4}
                      {...fieldProps("emergency_last_name")}
                    />

                    <div className={styles.span4}>
                      <FormSelect
                        name="emergency_relationship"
                        control={control}
                        label="Relationship"
                        options={relationships}
                      />
                    </div>

                    <PhoneField
                      codeName="emergency_mobile_code"
                      control={control}
                      label="Mobile No"
                      required
                      numberProps={fieldProps("emergency_mobile_no")}
                      className={styles.span6}
                    />

                    <TextField
                      label="Email Address"
                      type="email"
                      required
                      className={styles.span6}
                      {...fieldProps("emergency_email")}
                    />
                  </div>
                </section>
              </div>
            </div>
          </div>

          {/* =========================
              PROPERTY INFO TAB
          ========================== */}

          <div hidden={activeTab !== "property"} className={styles.tabPanel}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>Property Info</div>

              <div className={`${styles.sectionBody} ${styles.fieldGrid}`}>
                <div className={styles.span4}>
                  <FormSelect
                    name="master_development"
                    control={unitControl}
                    label="Master Development"
                    options={masterDevelopments}
                    required
                    error={unitErrors.master_development}
                    onChange={handleMasterDevelopmentChange}
                  />
                </div>

                <div className={styles.span4}>
                  <FormSelect
                    name="building"
                    control={unitControl}
                    label="Building"
                    options={filteredBuildings}
                    required
                    disabled={!selectedMasterDevelopment}
                    error={unitErrors.building}
                    onChange={handleBuildingChange}
                  />
                </div>

                <div className={styles.span4}>
                  <FormSelect
                    name="floor"
                    control={unitControl}
                    label="Floor"
                    options={filteredFloors}
                    required
                    disabled={!selectedBuilding}
                    error={unitErrors.floor}
                  />
                </div>

                <TextField
                  fullWidth
                  size="small"
                  label="Unit"
                  required
                  className={styles.span6}
                  {...unitRegister("unit")}
                  error={Boolean(unitErrors.unit)}
                  helperText={unitErrors.unit?.message}
                  // Enter adds the unit instead of submitting the customer form
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addUnit();
                    }
                  }}
                />

                <Controller
                  name="owner_occupied"
                  control={unitControl}
                  render={({ field }) => (
                    <FormControlLabel
                      className={styles.span3}
                      label="Owner Occupied"
                      control={
                        <Checkbox
                          checked={field.value}
                          onChange={(event) =>
                            field.onChange(event.target.checked)
                          }
                        />
                      }
                    />
                  )}
                />

                <div className={`${styles.span3} ${styles.addUnitAction}`}>
                  <Button
                    type="button"
                    variant="contained"
                    startIcon={<Plus size={16} />}
                    onClick={addUnit}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                Unit Details
                <span className={styles.unitCount}>
                  {units.length} {units.length === 1 ? "unit" : "units"}
                </span>
              </div>

              <div className={styles.sectionBody}>
                <div className={styles.unitGrid}>
                  {/* Mount only while visible: a grid inside a hidden
                      (display: none) panel measures 0px and warns. */}
                  {activeTab === "property" && (
                    <DataGrid
                      rows={units}
                      columns={unitColumns}
                      getRowId={(row) => row.id}
                      localeText={{ noRowsLabel: "No units added yet" }}
                      pageSizeOptions={[5, 10, 25]}
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: 5, page: 0 },
                        },
                      }}
                      disableRowSelectionOnClick
                    />
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* =========================
              DOCUMENTS TAB
          ========================== */}

          <div hidden={activeTab !== "documents"} className={styles.tabPanel}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>Upload Document</div>

              <div className={`${styles.sectionBody} ${styles.fieldGrid}`}>
                <div className={styles.span4}>
                  <FormSelect
                    name="document_type"
                    control={documentControl}
                    label="Document Type"
                    options={documentTypes}
                    required
                    error={documentErrors.document_type}
                  />
                </div>

                <TextField
                  fullWidth
                  size="small"
                  label="Document No"
                  className={styles.span4}
                  {...documentRegister("document_no")}
                  // Enter adds the document instead of submitting the form
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addDocument();
                    }
                  }}
                />

                <div className={styles.span4}>
                  <FormDatePicker
                    name="expiry_date"
                    control={documentControl}
                    label="Expiry Date"
                  />
                </div>

                <div className={styles.fullWidth}>
                  <label
                    className={`${styles.uploadBox} ${
                      dragActive ? styles.uploadBoxActive : ""
                    } ${documentFileError ? styles.uploadBoxError : ""}`}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDocumentDrop}
                  >
                    <input
                      type="file"
                      accept={DOCUMENT_EXTENSIONS.join(",")}
                      hidden
                      onChange={handleDocumentFileSelect}
                    />

                    <Upload size={26} />

                    <span className={styles.uploadTitle}>
                      Click to choose a file or drag it here
                    </span>

                    <span className={styles.uploadHint}>
                      PDF, JPG, PNG, DOC or DOCX up to {MAX_DOCUMENT_SIZE_MB} MB
                    </span>
                  </label>

                  {documentFile && (
                    <div className={styles.selectedFile}>
                      <Paperclip size={15} />
                      <span className={styles.selectedFileName}>
                        {documentFile.name}
                      </span>
                      <span className={styles.selectedFileSize}>
                        {formatFileSize(documentFile.size)}
                      </span>
                      <IconButton
                        size="small"
                        aria-label="Clear selected file"
                        onClick={() => setDocumentFile(null)}
                      >
                        <X size={14} />
                      </IconButton>
                    </div>
                  )}

                  {documentFileError && (
                    <div className={styles.uploadError}>
                      {documentFileError}
                    </div>
                  )}
                </div>

                <div className={`${styles.fullWidth} ${styles.addUnitAction}`}>
                  <Button
                    type="button"
                    variant="contained"
                    startIcon={<Plus size={16} />}
                    onClick={addDocument}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                Uploaded Documents
                <span className={styles.unitCount}>
                  {documents.length}{" "}
                  {documents.length === 1 ? "document" : "documents"}
                </span>
              </div>

              <div className={styles.sectionBody}>
                <div className={styles.unitGrid}>
                  {activeTab === "documents" && (
                    <DataGrid
                      rows={documents}
                      columns={documentColumns}
                      getRowId={(row) => row.id}
                      localeText={{ noRowsLabel: "No documents uploaded yet" }}
                      pageSizeOptions={[5, 10, 25]}
                      initialState={{
                        pagination: {
                          paginationModel: { pageSize: 5, page: 0 },
                        },
                      }}
                      disableRowSelectionOnClick
                    />
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* =========================
              PLACEHOLDER TABS
          ========================== */}

          {tabs
            .filter(
              (tab) =>
                !["general", "property", "documents"].includes(tab.value),
            )
            .map((tab) => (
              <div
                key={tab.value}
                hidden={activeTab !== tab.value}
                className={styles.tabPanel}
              >
                <section className={styles.section}>
                  <div className={styles.sectionHeader}>{tab.label}</div>

                  <div className={styles.placeholder}>
                    {tab.label} details will be added here.
                  </div>
                </section>
              </div>
            ))}

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
