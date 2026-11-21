"use client";

import { useMemo, useState } from "react";
import { LayoutDashboard, Settings } from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import DataTableToolbar from "../common/DataTableToolbar/DataTableToolbar"
import DataTableActions from "../common/DataTableActions/DataTableActions"
import {exportToExcel} from "../../utils/excel/exportExcel"
import {exportToPDF} from "../../utils/excel/exportPDF"
import { getDateTimeStamp } from "../../utils/date/formatTimestamp";
import { mockAccounts } from "../../data/accounts";

import styles from "./Accounts.module.css";

// flex lets columns stretch to fill the grid (no empty filler column on wide
// screens); minWidth keeps them readable and scrolls horizontally when narrow.
const columns = [
  {
    field: "orgId",
    headerName: "Org ID",
    flex: 0.6,
    minWidth: 120,
    hideable: false,
    required: true,
  },
  {
    field: "name",
    headerName: "Name",
    flex: 1.2,
    minWidth: 220,
    required: true,
  },
  {
    field: "pocId",
    headerName: "POC ID",
    flex: 0.6,
    minWidth: 120,
    required: true,
  },
  {
    field: "pocName",
    headerName: "POC Name",
    flex: 1,
    minWidth: 180,
    required: true,
  },
  {
    field: "address",
    headerName: "Address",
    flex: 1.4,
    minWidth: 250,
    required: true,
  },
  {
    field: "telephone",
    headerName: "Telephone",
    flex: 0.8,
    minWidth: 160,
    required: true,
  },
  {
    field: "mobile",
    headerName: "Mobile",
    flex: 0.8,
    minWidth: 160,
    required: true,
  },
];

export default function Accounts() {
  
  const [accounts, setAccounts] = useState(mockAccounts);

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  
  const [departmentFilter, setDepartmentFilter] = useState("");

  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const filteredAccounts = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    return accounts.filter((account) => {
      const matchesSearch =
  !search ||
  account.orgId?.toLowerCase().includes(search) ||
  account.name?.toLowerCase().includes(search) ||
  account.pocId?.toLowerCase().includes(search) ||
  account.pocName?.toLowerCase().includes(search) ||
  account.address?.toLowerCase().includes(search) ||
  account.telephone?.toLowerCase().includes(search) ||
  account.mobile?.toLowerCase().includes(search);

      const matchesStatus =
        !statusFilter || account.status === statusFilter;

      

      const matchesDepartment =
        !departmentFilter ||
        account.department === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
       
        matchesDepartment
      );
    });
  }, [
    accounts,
    searchText,
    statusFilter,
   
    departmentFilter,
  ]);
  const handleExportExcel = () => {
    const orgId = filteredAccounts[0]?.orgId || "OrgId";
    
      const fileName = `${orgId}-accounts-${getDateTimeStamp()}`;
      exportToExcel({
        data: filteredAccounts,
        columns,
        columnVisibilityModel,
        fileName: fileName,
      });
    };

    const handleExportPDF = () => {
      const orgId = filteredAccounts[0]?.orgId || "OrgId";
      const fileName = `${orgId}-accounts-${getDateTimeStamp()}`;
        exportToPDF({
          data: filteredAccounts,
          columns,
          columnVisibilityModel,
          fileName: fileName,
          title: "Admin Accounts",
        });
      };

  const statusOptions = useMemo(
    () =>
      [...new Set(accounts.map((account) => account.status))]
        .filter(Boolean),
    [accounts]
  );

  

  const departmentOptions = useMemo(
    () =>
      [...new Set(accounts.map((account) => account.department))]
        .filter(Boolean),
    [accounts]
  );

  const filterConfig = [
    {
      field: "status",
      label: "Status",
      value: statusFilter,
      options: statusOptions,
      onChange: setStatusFilter,
    },
   
    {
      field: "department",
      label: "Department",
      value: departmentFilter,
      options: departmentOptions,
      onChange: setDepartmentFilter,
    },
  ];

  const handleClearFilters = () => {
    setSearchText("");
    setStatusFilter("");
   
    setDepartmentFilter("");
  };

  const handleAddAccount = () => {
    console.log("Add account");
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="Accounts"
        subtitle="Manage user accounts and access"
        actions={null}
      />

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
            label: "Accounts",
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
          onClearFilters={() => {
            setSearchText("");
            setStatusFilter("");
            setCategoryFilter("");
            setLocationFilter("");
          }}
          columns={columns}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityChange={setColumnVisibilityModel}
        />
      </div>
       

        {/* <div className={styles.resultInfo}>
          Showing {filteredAccounts.length} of {accounts.length} accounts
        </div> */}

        <div className={styles.gridContainer}>
          <DataGrid
            rows={filteredAccounts}
            columns={columns}
            getRowId={(row) => row.orgId}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={
              setColumnVisibilityModel
            }
            pageSizeOptions={[5, 10, 25]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                  page: 0,
                },
              },
            }}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </div>
      
    </div>
  );
}