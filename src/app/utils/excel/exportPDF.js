import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const exportToPDF = ({
  data,
  columns,
  columnVisibilityModel = {},
  fileName = "export",
  title = "Report",
}) => {
  const doc = new jsPDF(
    "landscape",
    "mm",
    "a4"
  );

  const visibleColumns = columns.filter(
    (column) =>
      columnVisibilityModel[column.field] !== false
  );

  const headers = visibleColumns.map(
    (column) => column.headerName
  );

  const rows = data.map((row) =>
    visibleColumns.map(
      (column) => row[column.field] ?? ""
    )
  );

  doc.setFontSize(16);
  doc.text(title, 14, 15);

  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: 22,
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fontStyle: "bold",
    },
  });

  doc.save(`${fileName}.pdf`);
};