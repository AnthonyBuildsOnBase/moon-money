<template>
  <div>
    <!-- Container for the metrics cards -->
    <div class="metrics-container">
      <div class="header">
        <h2>Loan Totals</h2>
      </div>
      <div class="cards-wrapper">
        <div class="card" v-for="metric in metrics" :key="metric.id">
          <div class="card-content">
            <p class="value">{{ metric.value }}</p>
            <p class="description">{{ metric.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import USDC_balances from "@/assets/data/0xbdA0c74E10F166EdAbD5ed13A75efC2ae3Fa1896/Moonwell Flagship USDC_balances.json";
import ETH_balances from "@/assets/data/0xbdA0c74E10F166EdAbD5ed13A75efC2ae3Fa1896/Moonwell Flagship ETH_balances.json";

export default {
  name: "MetricsModule",
  data() {
    return {
      metrics: [
        {
          id: 1,
          title: "Total USDC",
          value: "$0", // Placeholder, will be updated dynamically
        },
        {
          id: 2,
          title: "Total Eth",
          value: "0", // Placeholder, will be updated dynamically
        },
      ],
    };
  },
  created() {
    this.updateAssetMetric("Total USDC", USDC_balances, true); // True indicates it's USD-based
    this.updateAssetMetric("Total Eth", ETH_balances, false); // False indicates it's ETH-based
  },
  methods: {
    updateAssetMetric(title, balances, isUSD) {
      // Sort balances by date (descending) to get the most recent balance
      const sortedBalances = balances.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      const mostRecentBalance = sortedBalances[0];

      if (mostRecentBalance && mostRecentBalance.assets) {
        const value = parseFloat(mostRecentBalance.assets).toFixed(2);

        // Update the metric with the given title
        const metric = this.metrics.find((metric) => metric.title === title);
        if (metric) {
          metric.value = isUSD ? `$${value}` : value;
        }
      }
    },
  },
};
</script>

<style>
.metrics-container {
  background-color: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  margin: 15px auto;
}

.header {
  text-align: center;
  margin-bottom: 15px;
}

.header h2 {
  margin-bottom: 0;
  font-size: 24px; /* Increased font size */
  font-weight: bold;
}

.cards-wrapper {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); /* Adjusted width to make cards smaller */
  gap: 15px;
}

.card {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
}

.card-content {
  display: flex;
  align-items: baseline;
}

.card-content .value {
  font-size: 24px;
  font-weight: bold;
  margin-right: 8px;
}

.card-content .description {
  font-size: 14px;
  color: #666;
  font-style: italic;
}
</style>
