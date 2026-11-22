"use client";

import { useMemo, useState } from "react";
import { Check, Settings, X } from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";
import { Alert, Button, Checkbox, Snackbar } from "@mui/material";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import FormSelect from "../createPPM/FormSelect";
import {
  accessActions,
  accessMenuItems,
  mockAccessSettings,
  roleAccessOptions,
  roleOptions,
} from "../../data/internalUserAccess";
import { internalUserAccessSchema } from "../../schemas/internalUserAccessSchema";

import styles from "./InternalUserAccess.module.css";

const ACTION_KEYS = accessActions.map(({ key }) => key);

const settingsKey = (role, roleAccess) => `${role}:${roleAccess}`;

const emptyRow = () =>
  Object.fromEntries(ACTION_KEYS.map((key) => [key, false]));

// Normalise saved settings so every menu item has every action flag
const buildPermissions = (saved = {}) =>
  Object.fromEntries(
    accessMenuItems.map(({ id }) => [id, { ...emptyRow(), ...saved[id] }])
  );

const isRowAll = (row) => ACTION_KEYS.every((key) => row[key]);
const isRowSome = (row) => ACTION_KEYS.some((key) => row[key]);

// Settings are mock data until the access-settings API is available.
// Replace the load / save below with service calls when it is.
export default function InternalUserAccess() {
  const [savedSettings, setSavedSettings] = useState(mockAccessSettings);
  const [permissions, setPermissions] = useState(() => buildPermissions());

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    control,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(internalUserAccessSchema),
    defaultValues: { role: "", roleAccess: "" },
  });

  const [role, roleAccess] = useWatch({
    control,
    name: ["role", "roleAccess"],
  });

  const hasSelection = Boolean(role && roleAccess);

  const savedPermissions = useMemo(
    () =>
      buildPermissions(
        hasSelection ? savedSettings[settingsKey(role, roleAccess)] : {}
      ),
    [hasSelection, savedSettings, role, roleAccess]
  );

  const isDirty =
    JSON.stringify(permissions) !== JSON.stringify(savedPermissions);

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseMessage = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Load the saved matrix whenever the role / role access selection changes
  const loadPermissions = (nextRole, nextRoleAccess) => {
    setPermissions(
      buildPermissions(
        nextRole && nextRoleAccess
          ? savedSettings[settingsKey(nextRole, nextRoleAccess)]
          : {}
      )
    );
  };

  /*
   * Checkbox toggles
   */
  const toggleCell = (menuId, actionKey, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [menuId]: { ...prev[menuId], [actionKey]: checked },
    }));
  };

  const toggleRow = (menuId, checked) => {
    setPermissions((prev) => ({
      ...prev,
      [menuId]: Object.fromEntries(ACTION_KEYS.map((key) => [key, checked])),
    }));
  };

  const toggleColumn = (actionKey, checked) => {
    setPermissions((prev) =>
      Object.fromEntries(
        Object.entries(prev).map(([id, row]) => [
          id,
          { ...row, [actionKey]: checked },
        ])
      )
    );
  };

  const toggleEverything = (checked) => {
    setPermissions(
      Object.fromEntries(
        accessMenuItems.map(({ id }) => [
          id,
          Object.fromEntries(ACTION_KEYS.map((key) => [key, checked])),
        ])
      )
    );
  };

  /*
   * Save / Cancel
   */
  const handleSave = async (values) => {
    try {
      // TODO: replace with the access-settings API once available
      setSavedSettings((prev) => ({
        ...prev,
        [settingsKey(values.role, values.roleAccess)]: permissions,
      }));

      showMessage("Access settings saved successfully.");
    } catch (error) {
      showMessage(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to save access settings.",
        "error"
      );
    }
  };

  const handleCancel = () => {
    setPermissions(savedPermissions);
  };

  /*
   * Grid
   */
  const rows = accessMenuItems.map((item) => ({
    ...item,
    ...permissions[item.id],
  }));

  const allRows = Object.values(permissions);
  const everythingChecked = allRows.every(isRowAll);
  const anythingChecked = allRows.some(isRowSome);

  const headerCheckbox = (label, checked, indeterminate, onChange) => (
    <label className={styles.headerCheckbox}>
      <Checkbox
        size="small"
        checked={checked}
        indeterminate={!checked && indeterminate}
        disabled={!hasSelection}
        onChange={(event) => onChange(event.target.checked)}
        slotProps={{ input: { "aria-label": `Select all ${label}` } }}
      />
      <span>{label}</span>
    </label>
  );

  const checkboxColumn = {
    flex: 1,
    minWidth: 115,
    sortable: false,
    filterable: false,
    hideable: false,
    disableColumnMenu: true,
  };

  const columns = [
    {
      field: "menuItem",
      headerName: "Menu Item",
      flex: 2.4,
      minWidth: 280,
      sortable: false,
      hideable: false,
      disableColumnMenu: true,
    },
    {
      ...checkboxColumn,
      field: "all",
      headerName: "All",
      renderHeader: () =>
        headerCheckbox(
          "All",
          everythingChecked,
          anythingChecked,
          toggleEverything
        ),
      renderCell: ({ row }) => {
        const rowPermissions = permissions[row.id];
        const checked = isRowAll(rowPermissions);

        return (
          <Checkbox
            size="small"
            checked={checked}
            indeterminate={!checked && isRowSome(rowPermissions)}
            disabled={!hasSelection}
            onChange={(event) => toggleRow(row.id, event.target.checked)}
            slotProps={{ input: { "aria-label": `All permissions for ${row.menuItem}` } }}
          />
        );
      },
    },
    ...accessActions.map(({ key, label }) => {
      const columnChecked = allRows.every((row) => row[key]);
      const columnSome = allRows.some((row) => row[key]);

      return {
        ...checkboxColumn,
        field: key,
        headerName: label,
        renderHeader: () =>
          headerCheckbox(label, columnChecked, columnSome, (checked) =>
            toggleColumn(key, checked)
          ),
        renderCell: ({ row }) => (
          <Checkbox
            size="small"
            checked={Boolean(permissions[row.id]?.[key])}
            disabled={!hasSelection}
            onChange={(event) =>
              toggleCell(row.id, key, event.target.checked)
            }
            slotProps={{ input: { "aria-label": `${label} for ${row.menuItem}` } }}
          />
        ),
      };
    }),
  ];

  return (
    <div className={styles.container}>
      <PageHeader
        title="Internal Users Access Settings"
        subtitle="Manage menu permissions for each role and role access"
      />

      <Breadcrumbs
        items={[
          { label: "Core", icon: <Settings size={18} /> },
          { label: "User Management" },
          { label: "Internal Users Access Settings" },
        ]}
      />

      <form
        className={styles.form}
        onSubmit={handleSubmit(handleSave)}
        noValidate
      >
        <section className={styles.section}>
          <div className={styles.sectionHeader}>Role Info</div>

          <div className={styles.sectionBody}>
            <FormSelect
              name="role"
              control={control}
              label="Role"
              options={roleOptions}
              required
              error={errors.role}
              onChange={(value) =>
                loadPermissions(value, getValues("roleAccess"))
              }
            />

            <FormSelect
              name="roleAccess"
              control={control}
              label="Role Access"
              options={roleAccessOptions}
              required
              error={errors.roleAccess}
              onChange={(value) => loadPermissions(getValues("role"), value)}
            />
          </div>
        </section>

        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            Role Access Details
            {!hasSelection && (
              <span className={styles.sectionHint}>
                Select a role and role access to edit permissions
              </span>
            )}
          </div>

          <div className={styles.gridBody}>
            <div className={styles.gridContainer}>
              <DataGrid
                rows={rows}
                columns={columns}
                getRowId={(row) => row.id}
                columnHeaderHeight={48}
                rowHeight={44}
                hideFooter
                disableRowSelectionOnClick
                disableColumnSorting
              />
            </div>

            <div className={styles.saveAndButton}>
              <Button
                variant="outlined"
                startIcon={<X size={15} />}
                onClick={handleCancel}
                disabled={isSubmitting || !isDirty}
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
          </div>
        </section>
      </form>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={handleCloseMessage}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
