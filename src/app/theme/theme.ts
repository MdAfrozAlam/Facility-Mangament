import { createTheme } from "@mui/material/styles";
import type {} from "@mui/x-data-grid/themeAugmentation";

// Mirrors the brand tokens in globals.css (--primary, --primary-dark,
// --secondary). MUI needs literal colors to derive hover/contrast shades,
// so keep these in sync if the palette changes.
const theme = createTheme({
  palette: {
    primary: {
      main: "#003671",
      dark: "#2F80ED", // hover shade, as on the login CTA
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2F80ED",
      contrastText: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Inter", Arial, sans-serif',
  },
  components: {
    // Shared look for every DataGrid: tinted header, zebra rows, brand-tinted
    // hover/selection. Grids can still override per-instance via `sx`.
    MuiDataGrid: {
      defaultProps: {
        // Parity relative to the page, so striping stays stable while the
        // grid virtualizes (CSS :nth-child would shift as rows recycle).
        getRowClassName: (params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "row--even" : "row--odd",
      },
      styleOverrides: {
        root: {
          "--DataGrid-t-header-background-base": "#f1f5fa",
          "--DataGrid-t-color-border-base": "#e8edf3",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          // Matches the 8px clipping radius of the .gridContainer wrappers.
          borderRadius: 8,
          color: "#0f172a",
          fontSize: 13.5,

          // Header
          "& .MuiDataGrid-columnHeader, & .MuiDataGrid-columnHeaders .MuiDataGrid-filler, & .MuiDataGrid-columnHeaders .MuiDataGrid-scrollbarFiller":
            {
              borderBottomColor: "#d3dce8",
            },
          "& .MuiDataGrid-columnHeaderTitle": {
            color: "#003671",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          },
          "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within": {
            outline: "none",
          },
          "& .MuiDataGrid-columnSeparator": {
            color: "#cbd5e1",
          },
          "& .MuiDataGrid-sortIcon, & .MuiDataGrid-menuIconButton": {
            color: "#64748b",
          },

          // Rows
          "& .MuiDataGrid-row.row--odd": {
            backgroundColor: "#fafbfd",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(47, 128, 237, 0.06)",
          },
          "& .MuiDataGrid-row.Mui-selected": {
            backgroundColor: "rgba(47, 128, 237, 0.10)",
            "&:hover": {
              backgroundColor: "rgba(47, 128, 237, 0.14)",
            },
          },
          "& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within": {
            outline: "2px solid rgba(47, 128, 237, 0.45)",
            outlineOffset: -2,
          },

          // Footer
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#fafbfc",
            borderTopColor: "#e2e8f0",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
          },
        },
      },
    },
  },
});

export default theme;
