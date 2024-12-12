<template>
  <div>
    <!-- Container for the title, dropdown, and chart -->
    <div class="chart-container">
      <div class="header">
        <h2>Loans Over Time</h2>
        <label for="asset-select">Select Asset:</label>
        <select
          id="asset-select"
          v-model="selectedAsset"
          @change="fetchData"
        >
          <option value="USDC">USDC</option>
          <option value="ETH">ETH</option>
        </select>
      </div>
      <div class="chart-wrapper">
        <canvas id="myChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import { Chart, registerables } from "chart.js";
import USDC_balances from "@/assets/data/0xbdA0c74E10F166EdAbD5ed13A75efC2ae3Fa1896/Moonwell Flagship USDC_balances.json";
import ETH_balances from "@/assets/data/0xbdA0c74E10F166EdAbD5ed13A75efC2ae3Fa1896/Moonwell Flagship ETH_balances.json";

Chart.register(...registerables);

export default {
  name: "Graph",
  data() {
    return {
      chart: null,
      selectedAsset: "USDC",
    };
  },
  methods: {
    fetchData() {
      try {
        const data =
          this.selectedAsset === "USDC" ? USDC_balances : ETH_balances;

        const sortedData = data.sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );

        const labels = sortedData.map((entry) => entry.date);
        const values = sortedData.map((entry) =>
          parseFloat(entry.assets || 0)
        );

        this.updateChart(labels, values);
      } catch (error) {
        console.error("Error fetching or processing data:", error);
      }
    },
    updateChart(labels, values) {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = document.getElementById("myChart").getContext("2d");
      this.chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: `${this.selectedAsset} Balances`,
              data: values,
              borderColor: this.selectedAsset === "USDC" ? "#ffa726" : "#42a5f5",
              backgroundColor:
                this.selectedAsset === "USDC"
                  ? "rgba(255, 167, 38, 0.2)"
                  : "rgba(66, 165, 245, 0.2)",
              tension: 0.4,
              pointStyle: "circle",
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                font: {
                  size: 14,
                  weight: "bold",
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Date",
                font: {
                  size: 16,
                  weight: "bold",
                },
              },
              ticks: {
                autoSkip: true,
                maxTicksLimit: 10,
                font: {
                  size: 12,
                },
              },
            },
            y: {
              title: {
                display: true,
                text: "Balances",
                font: {
                  size: 16,
                  weight: "bold",
                },
              },
              ticks: {
                beginAtZero: true,
                font: {
                  size: 12,
                },
              },
            },
          },
        },
      });
    },
  },
  mounted() {
    this.fetchData();
  },
};
</script>


<style>
  .chart-container {
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-width: 900px; /* Matches the max-width of Metrics Overview for consistency */
    margin: 20px auto; /* Centers horizontally and adds vertical spacing */
    display: flex;
    max-width: 900px;
    flex-direction: column; /* Aligns children vertically */
    align-items: center; /* Centers children horizontally */
  }


.header {
  text-align: center;
  margin-bottom: 0px;
}

.header h2 {
  margin-bottom: 0px;
}

.header label {
  font-weight: bold;
  margin-right: 10px;
}

.header select {
  padding: 5px;
  font-size: 16px;
  border-radius: 5px;
  border: 1px solid #ccc;
}

.chart-wrapper {
  position: relative;
  height: 500px; /* Increased height for better fit */
  padding: 10px; /* Added padding for spacing */
}

canvas {
  display: block;
  width: 100%;
  height: 100%; /* Ensure the canvas fits the wrapper */
  border-radius: 8px;
  background-color: #fff;
}
</style>
