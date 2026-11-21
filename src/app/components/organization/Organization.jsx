"use client";

import { useEffect, useMemo, useState } from "react";
import { Settings } from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";
import { Alert, IconButton, Snackbar, Tooltip } from "@mui/material";
import { DeleteOutlined, EditOutlined } from "@mui/icons-material";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import DataTableToolbar from "../common/DataTableToolbar/DataTableToolbar";
import DataTableActions from "../common/DataTableActions/DataTableActions";
import ConfirmDialog from "../common/ConfirmDialog/ConfirmDialog";
import { exportToExcel } from "../../utils/excel/exportExcel";
import { exportToPDF } from "../../utils/excel/exportPDF";
import { getDateTimeStamp } from "../../utils/date/formatTimestamp";
import {
  getOrganizations,
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from "../../services/organization/organizationService";
import { mockOrganizations } from "../../data/organizations";
import OrganizationDialog from "./OrganizationDialog/OrganizationDialog";

import styles from "./Organization.module.css";

// flex lets columns stretch to fill the grid (no empty filler column on wide
// screens); minWidth keeps them readable and scrolls horizontally when narrow.
const columns = [
  {
    field: "name",
    headerName: "Name",
    flex: 1.2,
    minWidth: 200,
    hideable: false,
  },
  {
    field: "contactPerson",
    headerName: "Contact Person",
    flex: 1,
    minWidth: 180,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1.2,
    minWidth: 220,
  },
  {
    field: "phone",
    headerName: "Phone",
    flex: 0.8,
    minWidth: 150,
  },
  {
    field: "telephone",
    headerName: "Telephone",
    flex: 0.8,
    minWidth: 150,
  },
  {
    field: "address",
    headerName: "Address",
    flex: 1.4,
    minWidth: 250,
  },
];

/*
 * The API returns address as { street, city, latitude, longitude }.
 * Flatten it so the grid, search and exports can use plain values.
 */
const toRow = (organization) => {
  const address =
    organization.address && typeof organization.address === "object"
      ? organization.address
      : {};

  return {
    ...organization,
    id: organization.id ?? organization._id,
    street: address.street ?? "",
    city: address.city ?? "",
    latitude: address.latitude ?? "",
    longitude: address.longitude ?? "",
    address:
      typeof organization.address === "string"
        ? organization.address
        : [address.street, address.city].filter(Boolean).join(", "),
  };
};

// Add already goes through POST /organizations. List, edit and delete still use
// dummy data from data/organizations.js until those APIs are ready.
// Set to false to read and write everything through organizationService.
const USE_MOCK_DATA = false;

const fetchOrganizations = async () => {
  if (USE_MOCK_DATA) return mockOrganizations.map(toRow);

  const data = await getOrganizations();
  const list = Array.isArray(data) ? data : data?.data;

  return (list ?? []).map(toRow);
};

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error ||
  fallback;

export default function Organization() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [organizationToDelete, setOrganizationToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseMessage = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  /*
   * Read
   */
  useEffect(() => {
    let active = true;

    fetchOrganizations()
      .then((rows) => {
        if (active) setOrganizations(rows);
      })
      .catch((error) => {
        if (!active) return;

        setSnackbar({
          open: true,
          message: getErrorMessage(error, "Failed to load organizations."),
          severity: "error",
        });
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Re-sync the grid with the server after a create / update / delete
  const refreshOrganizations = async () => {
    if (USE_MOCK_DATA) return;

    try {
      setOrganizations(await fetchOrganizations());
    } catch (error) {
      showMessage(
        getErrorMessage(error, "Failed to load organizations."),
        "error"
      );
    }
  };

  const filteredOrganizations = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    if (!search) return organizations;

    return organizations.filter((organization) =>
      columns.some((column) =>
        String(organization[column.field] ?? "")
          .toLowerCase()
          .includes(search)
      )
    );
  }, [organizations, searchText]);

  /*
   * Create / Update
   */
  const handleAdd = () => {
    setSelectedOrganization(null);
    setDialogOpen(true);
  };

  const handleEdit = (organization) => {
    setSelectedOrganization(organization);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSave = async (payload) => {
    const isEdit = Boolean(selectedOrganization);

    try {
      if (!isEdit) {
        // POST /organizations
        const data = await createOrganization(payload);

        if (USE_MOCK_DATA) {
          // The list is still mock data, so add the saved record to it here
          const created =
            data?.data && typeof data.data === "object" ? data.data : data;
          const row = toRow({ ...payload, ...created });

          setOrganizations((prev) => [
            ...prev,
            { ...row, id: row.id ?? `ORG-${Date.now()}` },
          ]);
        }
      } else if (USE_MOCK_DATA) {
        setOrganizations((prev) =>
          prev.map((organization) =>
            organization.id === selectedOrganization.id
              ? toRow({ ...payload, id: organization.id })
              : organization
          )
        );
      } else {
        await updateOrganization(selectedOrganization.id, payload);
      }

      setDialogOpen(false);

      showMessage(
        `Organization ${isEdit ? "updated" : "added"} successfully.`
      );

      await refreshOrganizations();
    } catch (error) {
      // keep the dialog open so the user doesn't lose what they typed
      showMessage(
        getErrorMessage(
          error,
          `Failed to ${isEdit ? "update" : "add"} organization.`
        ),
        "error"
      );
    }
  };

  /*
   * Delete
   */
  const handleConfirmDelete = async () => {
    if (deleting) return;

    setDeleting(true);

    try {
      if (USE_MOCK_DATA) {
        setOrganizations((prev) =>
          prev.filter(
            (organization) => organization.id !== organizationToDelete.id
          )
        );
      } else {
        await deleteOrganization(organizationToDelete.id);
      }

      showMessage("Organization deleted successfully.");

      await refreshOrganizations();
    } catch (error) {
      showMessage(
        getErrorMessage(error, "Failed to delete organization."),
        "error"
      );
    } finally {
      setDeleting(false);
      setOrganizationToDelete(null);
    }
  };

  const handleExportExcel = () => {
    exportToExcel({
      data: filteredOrganizations,
      columns,
      columnVisibilityModel,
      fileName: `organizations-${getDateTimeStamp()}`,
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      data: filteredOrganizations,
      columns,
      columnVisibilityModel,
      fileName: `organizations-${getDateTimeStamp()}`,
      title: "Organizations",
    });
  };

  // Row actions stay out of `columns` so they are not exported or toggled.
  const gridColumns = [
    ...columns,
    {
      field: "actions",
      headerName: "Actions",
      width: 110,
      sortable: false,
      filterable: false,
      hideable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <div className={styles.rowActions}>
          <Tooltip title="Edit">
            <IconButton
              size="small"
              color="primary"
              aria-label="Edit organization"
              onClick={() => handleEdit(params.row)}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              aria-label="Delete organization"
              onClick={() => setOrganizationToDelete(params.row)}
            >
              <DeleteOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <PageHeader
        title="Organization"
        subtitle="Manage organizations"
        actions={
          <DataTableActions
            showAdd
            addLabel="Add Organization"
            onAdd={handleAdd}
          />
        }
      />

      <Breadcrumbs
        items={[
          {
            label: "Core",
            icon: <Settings size={18} />,
          },
          {
            label: "Organization",
          },
        ]}
      />

      <div className={styles.actionsToolbar}>
        <DataTableActions
          showExportExcel
          showExportPDF
          onExportExcel={handleExportExcel}
          onExportPDF={handleExportPDF}
        />

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
          rows={filteredOrganizations}
          columns={gridColumns}
          getRowId={(row) => row.id}
          loading={loading}
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

      <OrganizationDialog
        open={dialogOpen}
        organization={selectedOrganization}
        onClose={handleCloseDialog}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={Boolean(organizationToDelete)}
        title="Delete Organization"
        message={`Are you sure you want to delete "${organizationToDelete?.name ?? ""}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setOrganizationToDelete(null)}
      />

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
