<template>
  <header>
    <div class="logo-container">
      <img src="@/assets/cartoon-moon.png" alt="Moon Logo" class="moon-logo" />
      <h1>MoonMoney</h1>
    </div>
    <ConnectWallet @wallet-connected="$emit('wallet-connected', $event)" />
  </header>
</template>

<script>
import ConnectWallet from './ConnectWallet.vue';
import { useWalletStore } from '@/stores/walletStore';

export default {
  name: 'Header',
  components: {
    ConnectWallet,
  },
};
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 10px; /* Add spacing between the image and the title */
}

.moon-logo {
  width: 70px;     /* Adjust size as needed */
  height: 70px;    /* Adjust size as needed */
}

header button {
  padding: 10px 20px;
  background-color: #0052FF;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

header button:hover {
  background-color: #0056b3;
}

/* Classification Dropdown */
.classification-dropdown {
  margin-top: 5px;
}

.classification-dropdown select,
.classification-dropdown input[type="text"],
.classification-dropdown button {
  margin-top: 5px;
  margin-right: 5px;
  padding: 5px;
  font-size: 12px;
}

/* Scrollable Transactions */
.scrollable-transactions {
  max-height: 300px;
  overflow-y: scroll;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 10px;
  background-color: #f9f9f9;
}

.transaction-summary {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.filter-options {
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
}

.filter-options label {
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}

.filter-checkbox {
  cursor: pointer;
}

#summary-list {
  list-style: none;
  padding: 0;
}

.summary-item {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}

/* Dropdown container */
.dropdown {
  position: relative;
  display: inline-block;
  margin-bottom: 10px;
}

/* Position the filter button in the top-right corner */
.filter-container {
  position: relative;
  display: inline-block;
  float: right;
}

/* Style for the filter button with icon */
#filter-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

#filter-btn img {
  width: 24px;
  height: 24px;
}

/* Dropdown content (hidden by default) */
.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
  padding: 10px;
  min-width: 150px;
  z-index: 1;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* Style for each filter checkbox label */
.dropdown-content label {
  display: block;
  padding: 5px 0;
  cursor: pointer;
}

/* Show dropdown when active */
.dropdown-content.show {
  display: block;
}

/* Summary list styling */
#summary-list {
  list-style: none;
  padding: 0;
}

.summary-item {
  padding: 5px 0;
  border-bottom: 1px solid #ddd;
}
</style>
