"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut,Pie  } from "react-chartjs-2";
import './AssetStatusChart.css'
import { mockAssets } from "../../data/assets";


ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function AssetStatusChart() {

  const statusCount = mockAssets.reduce(
    (acc, asset) => {

      acc[asset.status] =
        (acc[asset.status] || 0) + 1;

      return acc;

    },
    {}
  );

  const data = {

    labels: Object.keys(statusCount),

    datasets: [
      {
        label: "Assets",

        data: Object.values(statusCount),

        backgroundColor: [
          "#2e7d32",
          "#ed6c02",
          "#d32f2f",
          "#757575",
        ],

        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="chart-card">
        <h3>Asset Status</h3>
       <div className="chart-area">
        <Pie
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