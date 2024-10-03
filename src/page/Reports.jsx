import React, { useState } from "react";
import "./Reports.css";
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, CategoryScale } from 'chart.js';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale);

const Reports = () => {
  const [myChart, setMyChart] = useState(null);
  const [selectedDataType, setSelectedDataType] = useState("hour");

  const updateChart = (dateList, countList) => {
    const ctx = document.getElementById("reportChart").getContext("2d");

    if (myChart) {
      myChart.destroy(); // Destroy previous chart instance if exists
    }

    const newChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dateList,
        datasets: [{
          label: "Count",
          data: countList,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderWidth: 1,
          fill: true,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "white",
            },
          },
          x: {
            grid: {
              color: "white",
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "white",
            },
          },
          tooltip: {
            callbacks: {
              label: function (tooltipItem) {
                return `Count: ${tooltipItem.raw}`;
              },
            },
          },
        },
      },
    });

    setMyChart(newChart); // Save the new chart instance
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission

    const formData = new FormData(event.target);
    formData.set("data_type", selectedDataType); // Add the selected data type

    fetch("/get_trends", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        updateChart(data.date_list, data.count_list); // Update the chart with new data
      })
      .catch((error) => console.error("Error fetching trends:", error));
  };

  return (
    <div className="container">
      <h1 className="text-center">Reports</h1>
      <form id="dateForm" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="start_date">Start Date        </label>
          <input type="datetime-local" className="form-control" id="start_date" name="start_date" required />
        </div>
        <div className="form-group">
          <label htmlFor="end_date">End Date    </label>
          <input type="datetime-local" className="form-control" id="end_date" name="end_date" required />
        </div>
        <div className="form-group">
          <label>Data Type</label>
          <div className="button-group">
            <button
              type="button"
              className={`btn ${selectedDataType === 'hour' ? 'btn-report' : 'btn-nor'}`}
              onClick={() => setSelectedDataType('hour')}
            >
              Hourly
            </button>
            <button
              type="button"
              className={`btn ${selectedDataType === 'day' ? 'btn-report' : 'btn-nor'}`}
              onClick={() => setSelectedDataType('day')}
            >
              Daily
            </button>
            <button
              type="button"
              className={`btn ${selectedDataType === 'week' ? 'btn-report' : 'btn-nor'}`}
              onClick={() => setSelectedDataType('week')}
            >
              Weekly
            </button>
            <button
              type="button"
              className={`btn ${selectedDataType === 'month' ? 'btn-report' : 'btn-nor'}`}
              onClick={() => setSelectedDataType('month')}
            >
              Monthly
            </button>
          </div>
        </div>
        <button type="submit" className="btn btn-block">Generate Report</button>
      </form>

      <div className="card mt-4">
        <div className="card-body">
          <canvas id="reportChart"></canvas>
        </div>
      </div>
      <button className="btn-down">Download</button>
    </div>
  );
};

export default Reports;
