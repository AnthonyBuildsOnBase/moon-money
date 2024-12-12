<template>
  <div class="transactions">
    <h2>Transactions</h2>
    <!-- Manage Categories -->
    <ManageCategories
      :categories="categories.map((cat) => cat.name)"
      @create-category="createCategory"
      @delete-category="deleteCategory"
      @reset-categories="resetCategoriesToDefault"
    />
    </div>
    <div class="scrollable-transactions">
      <ul class="transaction-list">
        <li v-for="(transaction, index) in transactions" :key="transaction.Hash" class="transaction-item">
          <div class="transaction-row">
            <div class="transaction-main">
              <p class="transaction-detail"><strong>{{ transaction.Date }}</strong></p>
              <p class="transaction-detail">{{ transaction.From }}</p>
              <p class="transaction-detail">{{ transaction.To }}</p>
            </div>
            <div class="transaction-meta">
              <!-- Dynamic Dropdown with Colors -->
              <select
                v-model="transaction.category"
                class="category-select"
                :style="{ backgroundColor: getCategoryColor(transaction.category), color: '#fff' }"
              >
                <option value="" disabled>Select a category</option>
                <option
                  v-for="category in categories"
                  :key="category.name"
                  :value="category.name"
                >
                  {{ category.name }}
                </option>
              </select>
              <a
                :href="'https://basescan.org/tx/' + transaction.Hash"
                target="_blank"
                class="details-link"
              >
                Details
              </a>
            </div>
          </div>
        </li>
      </ul>
      
    </div>


</template>

<script>
import ManageCategories from './ManageCategories.vue';
import transactionsData from '@/assets/data/0xbdA0c74E10F166EdAbD5ed13A75efC2ae3Fa1896/cleanTransactions.json';
import preferences from '@/assets/data/0xbdA0c74E10F166EdAbD5ed13A75efC2ae3Fa1896/preferences.json';

export default {
  name: 'Transactions',
  components: {
    ManageCategories,
  },
  data() {
    return {
      transactions: transactionsData.map((tx) => ({ ...tx, category: '' })), // Transactions with empty category initially
      categories: this.getStoredCategories() || this.getDefaultCategories(), // Use stored or default categories
    };
  },
  methods: {
    createCategory(newCategory) {
      // Add a new category with a default color if it doesn't already exist
      if (!this.categories.some((cat) => cat.name === newCategory)) {
        this.categories.push({ name: newCategory, color: '#fff' }); // Default color
        this.storeCategories();
      }
    },
    deleteCategory(categoryName) {
      // Remove a category by name
      this.categories = this.categories.filter((cat) => cat.name !== categoryName);
      this.storeCategories();

      // Clear the category from transactions
      this.transactions.forEach((transaction) => {
        if (transaction.category === categoryName) {
          transaction.category = '';
        }
      });
    },
    resetCategoriesToDefault() {
      // Reset categories to the default set
      this.categories = this.getDefaultCategories();
      this.storeCategories();
    },
    storeCategories() {
      // Store categories in localStorage
      localStorage.setItem('UserChosenCategories', JSON.stringify(this.categories));
    },
    getStoredCategories() {
      // Retrieve stored categories from localStorage
      const storedCategories = localStorage.getItem('UserChosenCategories');
      return storedCategories ? JSON.parse(storedCategories) : null;
    },
    getDefaultCategories() {
      // Define default categories with colors
      return [
        { name: 'Groceries', color: '#5cb85c' },
        { name: 'Clothing', color: '#f0ad4e' },
        { name: 'Transportation', color: '#5bc0de' },
        { name: 'Eating Out', color: '#d9534f' },
        { name: 'Home', color: '#428bca' },
        { name: 'Other', color: '#999999' },
        { name: 'Swap', color: '#ffcc00' },
        { name: 'Loans', color: '#ff9999' },
        { name: 'Investment', color: '#8e44ad' },
      ];
    },
    getCategoryColor(categoryName) {
      // Get the color for a given category name
      const category = this.categories.find((cat) => cat.name === categoryName);
      return category ? category.color : '#344afb'; // Default color (gray) if category not found
    },
  },
};
</script>

<style scoped>
.transactions {
  font-family: Arial, sans-serif;
}
  .transactions {
    padding: 20px;

    font-family: Arial, sans-serif;
    background-color: #fff;
    color: #000;
    border-radius: 20px;

  }
  .scrollable-transactions {
    max-height: 500px;
    overflow-y: auto;
    padding: 10px;
    background-color: #fff; /* Ensure the parent has a white background */
  }

.transaction-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

  .transaction-item {
    display: flex;
    flex-direction: column;
    padding: 15px;
    border-bottom: 1px solid #ccc;
    background-color: #fff; /* Light gray background */
  }


.transaction-item:last-child {
  border-bottom: none;
}

.transaction-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.transaction-main {
  display: flex;
  flex-direction: column;
}

.transaction-detail {
  margin: 5px 0;
}

.transaction-meta {
  display: flex;
  align-items: center;
}

.category-select {
  border: none;
  border-radius: 20px;
  padding: 5px 15px;
  font-size: 14px;
  margin-right: 10px;
  outline: none;
  transition: all 0.3s ease;
  cursor: pointer;
  color: #fff;
}

.details-link {
  text-decoration: none;
  color: #007bff;
  font-size: 14px;
  padding: 5px 10px;
  border: 1px solid #007bff;
  border-radius: 20px;
  transition: all 0.3s ease;
}

.details-link:hover {
  background-color: #007bff;
  color: #fff;
}


</style>
