<template>
  <div class="transaction-summary">
    <h2>Transaction Summary</h2>
    <div class="filter-container">
      <button id="filter-btn">
        <i class="fas fa-filter"></i>
      </button>
      <div class="dropdown-content" id="dropdown-content">
        <label><input type="checkbox" value="NFT" checked /> NFT</label>
        <label><input type="checkbox" value="Swap" checked /> Swap</label>
        <label><input type="checkbox" value="Lending" checked /> Lending</label>
        <label><input type="checkbox" value="Other" checked /> Other</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransactionSummary',
};
</script>

<style scoped>
/* Add any specific styles for TransactionSummary here */
</style>
