"use client";

import { useRef, useState, useMemo } from "react";
import * as XLSX from "xlsx";
import { DataGrid } from "@mui/x-data-grid";
import DataTableToolbar from "../common/DataTableToolbar/DataTableToolbar";
import DataTableActions from "../common/DataTableActions/DataTableActions";
import { exportToExcel } from "../../utils/excel/exportExcel";
import { exportToPDF } from "../../utils/excel/exportPDF";
import { importFromExcel } from "../../utils/excel/importExcel";
import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import { getDateTimeStamp } from "../../utils/date/formatTimestamp";
import BulkRegisterDialog from '../../components/BulkRegisterDialog/BulkRegisterDialog'
import { downloadExcelTemplate } from "../../utils/excel/downloadExcelTemplate";
import AddRegisterDialog from "./AddRegisterDialog/AddRegisterDialog";

import {
  Alert,
  
  Link as MuiLink,
  Snackbar,
 
} from "@mui/material";

// import { UploadFile, FileDownload, PictureAsPdf } from "@mui/icons-material";

import { mockAssets } from "../../data/assets";

import styles from "./AssetRegister.module.css";
import AssetCategoryChart from "../charts/AssetCategoryChart";
import AssetStattusChart from "../charts/AssetStatusChart";
import { BriefcaseBusiness, LayoutDashboard } from "lucide-react";

export default function AssetRegister() {
  const [addRegisterOpen, setAddRegisterOpen] =useState(false);
  const [bulkRegisterOpen, setBulkRegisterOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [assets, setAssets] = useState(mockAssets);
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const [message, setMessage] = useState("");

  const [messageType, setMessageType] = useState("success");

  const fileInputRef = useRef(null);

const columns = [
  {
    field: "id",
    headerName: "Asset ID",
    excelField: "asset_id",
    width: 120,
    hideable: false,
    required: false,
    includeInTemplate: false,
  },
  {
    field: "assetName",
    headerName: "Asset Name",
    excelField: "asset_name",
    width: 220,
    required: true,
    includeInTemplate: true,
  },
  {
    field: "category",
    headerName: "Category",
    excelField: "category",
    width: 160,
    required: true,
    includeInTemplate: true,
  },
  {
    field: "subCategory",
    headerName: "Sub Category",
    excelField: "sub_category",
    width: 180,
    required: true,
    includeInTemplate: true,
  },
  {
    field: "status",
    headerName: "Status",
    excelField: "status",
    width: 140,
    required: true,
    includeInTemplate: true,
  },
  {
    field: "location",
    headerName: "Location",
    excelField: "location",
    width: 130,
    required: true,
    includeInTemplate: true,
  },
  {
    field: "department",
    headerName: "Department",
    excelField: "department",
    width: 170,
    required: true,
    includeInTemplate: true,
  },
  {
    field: "purchaseDate",
    headerName: "Purchase Date",
    excelField: "purchase_date",
    width: 150,
    required: true,
    includeInTemplate: true,
  },
  {
    field: "assignedTo",
    headerName: "Assigned To",
    excelField: "assigned_to",
    width: 180,
    required: true,
    includeInTemplate: true,
  },
];

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const search = searchText.toLowerCase().trim();

      const matchesSearch =
        !search ||
        asset.id?.toLowerCase().includes(search) ||
        asset.assetName?.toLowerCase().includes(search) ||
        asset.category?.toLowerCase().includes(search) ||
        asset.subCategory?.toLowerCase().includes(search) ||
        asset.location?.toLowerCase().includes(search) ||
        asset.department?.toLowerCase().includes(search) ||
        asset.assignedTo?.toLowerCase().includes(search);

      const matchesStatus = !statusFilter || asset.status === statusFilter;

      const matchesCategory =
        !categoryFilter || asset.category === categoryFilter;

      const matchesLocation =
        !locationFilter || asset.location === locationFilter;

      return (
        matchesSearch && matchesStatus && matchesCategory && matchesLocation
      );
    });
  }, [assets, searchText, statusFilter, categoryFilter, locationFilter]);

  /*
   * Open file picker
   */
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  

  /*
   * Handle selected Excel file
   */
  const handleFileImport = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      const importedAssets = await importFromExcel({
        file,
        columns,
        dateFields: ["purchaseDate"],
      });

      setAssets(importedAssets);

      setSnackbar({
        open: true,
        message: `${importedAssets.length} assets imported successfully.`,
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to import Excel file.",
        severity: "error",
      });
    } finally {
      event.target.value = "";
    }
  };

  // Show / Hide column

  /*
   * Export Excel
   *
   * We'll implement this next.
   */
  const handleExportExcel = () => {
    const orgId = filteredAssets[0]?.orgId || "OrgId";

  const fileName = `${orgId}-asset-register-${getDateTimeStamp()}`;
    exportToExcel({
      data: filteredAssets,
      columns,
      columnVisibilityModel,
      fileName: fileName,
    });
  };

  /*
   * Export PDF
   *
   * We'll implement this after Excel export.
   */
  const handleExportPDF = () => {
    exportToPDF({
      data: filteredAssets,
      columns,
      columnVisibilityModel,
      fileName: "asset-register",
      title: "Asset Register",
    });
  };

  const handleDownloadTemplate = () => {
  downloadExcelTemplate({
    columns,
    fileName: "asset-register-template",
    sheetName: "Asset Register",
  });
};
  /*
   * Close snackbar
   */
  const handleCloseMessage = () => {
    setMessage("");
  };

 

const handleBulkRegister = () => {
  setBulkRegisterOpen(true);
};

const handleCloseBulkRegister = () => {
  setBulkRegisterOpen(false);
};

const handleAddRegister = () => {
  setAddRegisterOpen(true);
};

const handleRegister = (formData) => {
  const newAsset = {
    ...formData,
    id: `AST-${String(assets.length + 1).padStart(3, "0")}`,
  };

  setAssets((prev) => [
    ...prev,
    newAsset,
  ]);
  console.log(formData, 'formData===>');
  
};


  // format date
  const formatExcelDate = (value) => {
    if (!value) {
      return "";
    }

    // Already a Date object
    if (value instanceof Date) {
      return value.toISOString().split("T")[0];
    }

    // Excel serial number
    if (typeof value === "number") {
      const excelDate = XLSX.SSF.parse_date_code(value);

      if (!excelDate) {
        return "";
      }

      const year = excelDate.y;
      const month = String(excelDate.m).padStart(2, "0");
      const day = String(excelDate.d).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    // String date
    return String(value);
  };

  const statusOptions = useMemo(
    () => [...new Set(assets.map((asset) => asset.status).filter(Boolean))],
    [assets],
  );

  const categoryOptions = useMemo(
    () => [...new Set(assets.map((asset) => asset.category).filter(Boolean))],
    [assets],
  );

  const locationOptions = useMemo(
    () => [...new Set(assets.map((asset) => asset.location).filter(Boolean))],
    [assets],
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
      field: "category",
      label: "Category",
      value: categoryFilter,
      options: categoryOptions,
      onChange: setCategoryFilter,
    },
    {
      field: "location",
      label: "Location",
      value: locationFilter,
      options: locationOptions,
      onChange: setLocationFilter,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Page Header */}

      <PageHeader
        title="Asset Register"
        subtitle="Manage and track assets"
         actions={
      <DataTableActions
      showAdd
      showBulkRegister
      showDownloadTemplate
      onAdd={handleAddRegister}
      onBulkRegister={handleBulkRegister}
      onDownloadTemplate={handleDownloadTemplate}
    />
  }
       
      />

      <Breadcrumbs
        items={[
          
          {
            label: "Asset Management",
            icon: <BriefcaseBusiness size={18} />,
          },
          {
            label: "Asset Register",
          },
        ]}
      />

      {/* Hidden file input */}

      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        hidden
        onChange={handleFileImport}
      />

      <div className={styles.actionsToolbar}>
        <DataTableActions
          showExportExcel
          showExportPDF
          onImport={handleImportClick}
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

      {/* Data Grid */}

      <div className={styles.gridContainer}>
        <DataGrid
          rows={filteredAssets}
          columns={columns}
          getRowId={(row) => row.id}
          columnVisibilityModel={columnVisibilityModel}
          onColumnVisibilityModelChange={setColumnVisibilityModel}
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
          sx={
            {
              // your existing styles
            }
          }
        />
      </div>

      {/* Import message */}

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={4000}
        onClose={handleCloseMessage}
      >
        <Alert
          severity={messageType}
          onClose={handleCloseMessage}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>

      <BulkRegisterDialog
   open={bulkRegisterOpen}
  onClose={() => setBulkRegisterOpen(false)}
  onDownloadTemplate={handleDownloadTemplate}
  columns={columns}
  existingAssets={assets}
/>

<AddRegisterDialog
  open={addRegisterOpen}
  onClose={() => setAddRegisterOpen(false)}
  onRegister={handleRegister}
/>

      <div className={styles.chartGrid}>
        <div className={styles.chartSection}>
          <AssetCategoryChart assets={assets} />
        </div>
        <div className={styles.chartSection}>
          <AssetStattusChart assets={assets} />
        </div>
      </div>
    </div>
  );
}
