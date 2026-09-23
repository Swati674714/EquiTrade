// import React from "react";
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend,
// } from "chart.js";
// import { Bar } from "react-chartjs-2";

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   Title,
//   Tooltip,
//   Legend
// );

// export const options = {
//   responsive: true,
//   plugins: {
//     legend: {
//       position: "top",
//     },
//     title: {
//       display: true,
//       text: "Holdings",
//     },
//   },
// };

// export function VerticalGraph({ data }) {
//   return <Bar options={options} data={data} />;
// }
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#333",
        font: {
          size: 14,
          weight: "bold",
        },
      },
    },
    title: {
      display: true,
      text: "Holdings Over Time",
      color: "#444",
      font: {
        size: 18,
        weight: "bold",
      },
    },
    tooltip: {
      mode: "index",
      intersect: false,
    },
  },
  interaction: {
    mode: "nearest",
    axis: "x",
    intersect: false,
  },
  scales: {
    x: {
      ticks: { color: "#333", font: { size: 12 } },
      grid: { color: "rgba(0,0,0,0.1)" },
    },
    y: {
      ticks: { color: "#333", font: { size: 12 } },
      grid: { color: "rgba(0,0,0,0.1)" },
    },
  },
};

export function VerticalGraph({ data }) {
  if (!data || !data.labels || data.labels.length === 0) {
    return <p>No data available to display the graph.</p>;
  }

  // Customize dataset colors
  const styledData = {
    ...data,
    datasets: data.datasets.map((ds, idx) => ({
      ...ds,
      borderColor: `hsl(${idx * 60}, 70%, 50%)`,
      backgroundColor: `hsla(${idx * 60}, 70%, 50%, 0.2)`,
      tension: 0.3, // smooth line
      pointRadius: 5,
      pointHoverRadius: 7,
      fill: true,
    })),
  };

  return <Line options={options} data={styledData} />;
}
