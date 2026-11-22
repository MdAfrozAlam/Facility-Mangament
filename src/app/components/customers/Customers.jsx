"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
import { mockCustomers } from "../../data/customers";

import styles from "./Customers.module.css";

const ADD_CUSTOMER_PATH = "/admin/core/user-management/customers/add-customer";

const STATUS_CLASS = {
  Active: styles.statusActive,
  Inactive: styles.statusInactive,
  Pending: styles.statusPending,
};

// flex lets columns stretch to fill the grid; minWidth keeps them readable
// and scrolls horizontally when narrow.
const columns = [
  {
    field: "status",
    headerName: "Status",
    flex: 0.7,
    minWidth: 110,
    renderCell: (params) => (
      <span className={`${styles.status} ${STATUS_CLASS[params.value] ?? ""}`}>
        {params.value}
      </span>
    ),
  },
  {
    field: "refNo",
    headerName: "Ref No",
    flex: 0.7,
    minWidth: 110,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1.1,
    minWidth: 180,
    hideable: false,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1.3,
    minWidth: 220,
  },
  {
    field: "mobileNumber",
    headerName: "Mobile Number",
    flex: 0.9,
    minWidth: 150,
  },
  {
    field: "type",
    headerName: "Type",
    flex: 0.7,
    minWidth: 110,
  },
  {
    field: "md",
    headerName: "MD",
    flex: 0.5,
    minWidth: 90,
  },
  {
    field: "building",
    headerName: "Building",
    flex: 1,
    minWidth: 170,
  },
  {
    field: "floorCode",
    headerName: "Floor Code",
    flex: 0.6,
    minWidth: 110,
  },
  {
    field: "units",
    headerName: "Units",
    flex: 0.7,
    minWidth: 120,
  },
];

const uniqueValues = (rows, field) =>
  [...new Set(rows.map((row) => row[field]))].filter(Boolean).sort();

// Data comes from data/customers.js until the customers API is ready.
export default function Customers() {
  const router = useRouter();

  const [customers, setCustomers] = useState(mockCustomers);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [buildingFilter, setBuildingFilter] = useState("");
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const [customerToDelete, setCustomerToDelete] = useState(null);

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

  const filteredCustomers = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    return customers.filter((customer) => {
      const matchesSearch =
        !search ||
        columns.some((column) =>
          String(customer[column.field] ?? "")
            .toLowerCase()
            .includes(search)
        );

      const matchesStatus = !statusFilter || customer.status === statusFilter;
      const matchesType = !typeFilter || customer.type === typeFilter;
      const matchesBuilding =
        !buildingFilter || customer.building === buildingFilter;

      return matchesSearch && matchesStatus && matchesType && matchesBuilding;
    });
  }, [customers, searchText, statusFilter, typeFilter, buildingFilter]);

  const filterConfig = [
    {
      field: "status",
      label: "Status",
      value: statusFilter,
      options: uniqueValues(customers, "status"),
      onChange: setStatusFilter,
    },
    {
      field: "type",
      label: "Type",
      value: typeFilter,
      options: uniqueValues(customers, "type"),
      onChange: setTypeFilter,
    },
    {
      field: "building",
      label: "Building",
      value: buildingFilter,
      options: uniqueValues(customers, "building"),
      onChange: setBuildingFilter,
    },
  ];

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter("");
    setTypeFilter("");
    setBuildingFilter("");
  };

  const handleAdd = () => {
    router.push(ADD_CUSTOMER_PATH);
  };

  // Edit is a placeholder until the add form can load an existing customer.
  const handleEdit = () => {};

  const handleConfirmDelete = () => {
    setCustomers((prev) =>
      prev.filter((customer) => customer.id !== customerToDelete.id)
    );
    showMessage("Customer deleted successfully.");
    setCustomerToDelete(null);
  };

  const handleExportExcel = () => {
    exportToExcel({
      data: filteredCustomers,
      columns,
      columnVisibilityModel,
      fileName: `customers-${getDateTimeStamp()}`,
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      data: filteredCustomers,
      columns,
      columnVisibilityModel,
      fileName: `customers-${getDateTimeStamp()}`,
      title: "Customers",
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
              aria-label="Edit customer"
              onClick={() => handleEdit(params.row)}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton
              size="small"
              color="error"
              aria-label="Delete customer"
              onClick={() => setCustomerToDelete(params.row)}
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
        title="Customers"
        subtitle="Manage customers and their units"
        actions={
          <DataTableActions showAdd addLabel="New" onAdd={handleAdd} />
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
            label: "Customers",
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
          filters={filterConfig}
          onClearFilters={handleClearFilters}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityChange={setColumnVisibilityModel}
        />
      </div>

      <div className={styles.gridContainer}>
        <DataGrid
          rows={filteredCustomers}
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

      <ConfirmDialog
        open={Boolean(customerToDelete)}
        title="Delete Customer"
        message={`Are you sure you want to delete "${customerToDelete?.name ?? ""}"? This action cannot be undone.`}
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setCustomerToDelete(null)}
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
