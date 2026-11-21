"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";
import { DataGrid } from "@mui/x-data-grid";

import PageHeader from "../common/PageHeader/PageHeader";
import Breadcrumbs from "../common/Breadcrumbs/Breadcrumbs";
import DataTableToolbar from "../common/DataTableToolbar/DataTableToolbar";
import DataTableActions from "../common/DataTableActions/DataTableActions";
import { exportToExcel } from "../../utils/excel/exportExcel";
import { exportToPDF } from "../../utils/excel/exportPDF";
import { getDateTimeStamp } from "../../utils/date/formatTimestamp";
import { mockProjects } from "../../data/projects";

import styles from "./Project.module.css";

// Dates are stored as YYYY-MM-DD; show them as DD/MM/YYYY in the grid.
const formatDate = (value) => {
  if (!value) return "";

  const [year, month, day] = String(value).split("-");

  return day ? `${day}/${month}/${year}` : value;
};

const statusClassNames = {
  Active: styles.statusActive,
  Completed: styles.statusCompleted,
  Planned: styles.statusPlanned,
  "On Hold": styles.statusOnHold,
};

// flex lets columns stretch to fill the grid (no empty filler column on wide
// screens); minWidth keeps them readable and scrolls horizontally when narrow.
const columns = [
  {
    field: "reference_no",
    headerName: "Reference No.",
    flex: 0.8,
    minWidth: 150,
    hideable: false,
  },
  {
    field: "project_code",
    headerName: "Project Code",
    flex: 0.8,
    minWidth: 140,
  },
  {
    field: "project",
    headerName: "Project",
    flex: 1.6,
    minWidth: 260,
  },
  {
    field: "md",
    headerName: "MD",
    flex: 1,
    minWidth: 160,
  },
  {
    field: "start_date",
    headerName: "Start Date",
    flex: 0.7,
    minWidth: 130,
    valueFormatter: formatDate,
  },
  {
    field: "end_date",
    headerName: "End Date",
    flex: 0.7,
    minWidth: 130,
    valueFormatter: formatDate,
  },
  {
    field: "status",
    headerName: "Status",
    flex: 0.7,
    minWidth: 130,
    renderCell: (params) => (
      <span
        className={`${styles.status} ${statusClassNames[params.value] ?? ""}`}
      >
        {params.value}
      </span>
    ),
  },
];

export default function Project() {
  const router = useRouter();

  // Static data from data/projects.js until the project API is ready.
  const [projects] = useState(mockProjects);

  const [searchText, setSearchText] = useState("");
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({});

  const filteredProjects = useMemo(() => {
    const search = searchText.toLowerCase().trim();

    if (!search) return projects;

    return projects.filter((project) =>
      columns.some((column) =>
        String(project[column.field] ?? "")
          .toLowerCase()
          .includes(search)
      )
    );
  }, [projects, searchText]);

  const handleExportExcel = () => {
    exportToExcel({
      data: filteredProjects,
      columns,
      columnVisibilityModel,
      fileName: `projects-${getDateTimeStamp()}`,
    });
  };

  const handleExportPDF = () => {
    exportToPDF({
      data: filteredProjects,
      columns,
      columnVisibilityModel,
      fileName: `projects-${getDateTimeStamp()}`,
      title: "Projects",
    });
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="Projects"
        subtitle="Manage projects"
        actions={
          <DataTableActions
            showAdd
            addLabel="Add Project"
            onAdd={() => router.push("/admin/core/administration/add/project")}
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
            label: "Administration",
          },
          {
            label: "Projects",
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
          rows={filteredProjects}
          columns={columns}
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
    </div>
  );
}
