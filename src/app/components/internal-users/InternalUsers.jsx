"use client";

import { useMemo, useState } from "react";
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
import { mockInternalUsers } from "../../data/internalUsers";
import InternalUserDialog from "./InternalUserDialog/InternalUserDialog";

import styles from "./InternalUsers.module.css";

// flex lets columns stretch to fill the grid; minWidth keeps them readable
// and scrolls horizontally when narrow.
const columns = [
  {
    field: "id",
    headerName: "Id",
    flex: 0.6,
    minWidth: 110,
    hideable: false,
  },
  {
    field: "roleCode",
    headerName: "Role Code",
    flex: 0.8,
    minWidth: 140,
  },
  {
    field: "roleName",
    headerName: "Role Name",
    flex: 1.2,
    minWidth: 200,
  },
  {
    field: "roleAccessCode",
    headerName: "Role Access Code",
    flex: 0.9,
    minWidth: 170,
  },
  {
    field: "roleAccessName",
    headerName: "Role Access Name",
    flex: 1.2,
    minWidth: 200,
  },
];

// No internal-users API yet: the grid works on mock data from
// data/internalUsers.js. Add a service + USE_MOCK_DATA flag (see Organization)
// when the endpoints are ready.
const nextId = (rows) => {
  const max = rows.reduce((highest, row) => {
    const number = Number(String(row.id).replace(/\D/g, ""));

    return Number.isFinite(number) && number > highest ? number : highest;
  }, 0);

  return `IU-${String(max + 1).padStart(3, "0")}`;
};

export default function InternalUsers() {
  const [users, setUsers] = useState(mockInternalUsers);

  const [searchText, setSearchText] = useState("");
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

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

  const filteredUsers = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    if (!search) return users;

    return users.filter((user) =>
      columns.some((column) =>
        String(user[column.field] ?? "")
          .toLowerCase()
          .includes(search)
      )
    );
  }, [users, searchText]);

  /*
   * Create / Update
   */
  const handleAdd = () => {
    setSelectedUser(null);
    setDialogOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  const handleSave = (payload) => {
    const isEdit = Boolean(selectedUser);

    if (isEdit) {
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id ? { ...user, ...payload } : user
        )
      );
    } else {
      setUsers((prev) => [...prev, { ...payload, id: nextId(prev) }]);
    }

    setDialogOpen(false);
    showMessage(`Internal user ${isEdit ? "updated" : "added"} successfully.`);
  };

  /*
   * Delete
   */
  const handleConfirmDelete = () => {
    setUsers((prev) => prev.filter((user) => user.id !== userToDelete.id));
    setUserToDelete(null);
    showMessage("Internal user deleted successfully.");
  };

  const handleExportExcel = () => {
    exportToExcel({
      data: filteredUsers,
      columns,
      columnVisibilityModel,
      fileName: `internal-users-${getDateTimeStamp()}`,
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      data: filteredUsers,
      columns,
      columnVisibilityModel,
      fileName: `internal-users-${getDateTimeStamp()}`,
      title: "Internal Users",
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
              aria-label="Edit internal user"
              onClick={() => handleEdit(params.row)}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              aria-label="Delete internal user"
              onClick={() => setUserToDelete(params.row)}
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
        title="Internal Users"
        subtitle="Manage internal user roles and access"
        actions={
          <DataTableActions
            showAdd
            addLabel="New"
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
            label: "User Management",
          },
          {
            label: "Internal Users",
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
          rows={filteredUsers}
          columns={gridColumns}
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

      <InternalUserDialog
        open={dialogOpen}
        user={selectedUser}
        onClose={handleCloseDialog}
        onSubmit={handleSave}
      />

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Delete Internal User"
        message={`Are you sure you want to delete "${userToDelete?.roleName ?? ""}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
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
