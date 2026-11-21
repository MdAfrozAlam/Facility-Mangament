"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

import { Doughnut } from "react-chartjs-2";
import './AssetCategoryChart.css'

ChartJS.register(ArcElement, Tooltip, Legend);

const mockAssets = [
  {
    id: "AST-001",
    assetName: "Dell Latitude 5420",
    category: "IT Equipment",
    subCategory: "Laptop",
    status: "Active",
    location: "Pune",
    department: "IT",
    purchaseDate: "2024-01-15",
    assignedTo: "Afroz Alam",
  },
  {
    id: "AST-002",
    assetName: "HP LaserJet Pro",
    category: "IT Equipment",
    subCategory: "Printer",
    status: "Active",
    location: "Mumbai",
    department: "Administration",
    purchaseDate: "2023-08-20",
    assignedTo: "Rahul Sharma",
  },
  {
    id: "AST-003",
    assetName: "Daikin Split AC",
    category: "Facility",
    subCategory: "Air Conditioner",
    status: "Under Repair",
    location: "Nagpur",
    department: "Facility",
    purchaseDate: "2022-05-10",
    assignedTo: "Facility Team",
  },
  {
    id: "AST-004",
    assetName: "Office Desk",
    category: "Furniture",
    subCategory: "Desk",
    status: "Active",
    location: "Pune",
    department: "Administration",
    purchaseDate: "2023-11-05",
    assignedTo: "HR Team",
  },
  {
    id: "AST-005",
    assetName: "Cisco Switch",
    category: "IT Equipment",
    subCategory: "Network",
    status: "Active",
    location: "Mumbai",
    department: "IT",
    purchaseDate: "2024-03-12",
    assignedTo: "Network Team",
  },
];

function AssetCategoryChart() {
  const categoryCount = mockAssets.reduce((acc, asset) => {
    acc[asset.category] = (acc[asset.category] || 0) + 1;

    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryCount),

    datasets: [
      {
        label: "Assets",
        data: Object.values(categoryCount),

        backgroundColor: ["#1976d2", "#2e7d32", "#ed6c02"],

        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>Assets by Category</h3>

      <div className="chart-area">
        <Doughnut
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
}

export default AssetCategoryChart;
