<template>
  <div class="categories-management">
    <h3 @click="toggleOpen" class="categories-header">
      Manage Categories
      <span>{{ isOpen ? '▲' : '▼' }}</span>
    </h3>
    <div v-if="isOpen" class="categories-content">
      <ul>
        <li v-for="(category, index) in categories" :key="index">
          {{ category }}
          <button @click="$emit('delete-category', category)">Delete</button>
        </li>
      </ul>
      <div class="new-category">
        <input v-model="newCategory" placeholder="Enter new category" />
        <button @click="createCategory">Create Category</button>
        <button @click="resetToDefault">Reset to Default</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: Array, // Receive categories as a prop
  },
  data() {
    return {
      isOpen: false,
      newCategory: '',
    };
  },
  methods: {
    toggleOpen() {
      this.isOpen = !this.isOpen; // Toggle the open/close state
    },
    createCategory() {
      if (this.newCategory && !this.categories.includes(this.newCategory)) {
        this.$emit('create-category', this.newCategory); // Emit event to parent
        this.newCategory = ''; // Clear input field
      }
    },
    resetToDefault() {
      this.$emit('reset-categories'); // Emit reset to default event to parent
    },
  },
};
</script>

<style scoped>
.categories-management {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
}

.categories-header {
  cursor: pointer;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.categories-content {
  margin-top: 10px;
}

.categories-content ul {
  list-style: none;
  padding: 0;
}

.categories-content li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
}

.categories-content button {
  padding: 5px;
  background-color: #ff4d4d;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.categories-content button:hover {
  background-color: #cc0000;
}

.new-category {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.new-category input {
  padding: 5px;
  width: 200px;
}

.new-category button {
  padding: 5px 10px;
  background-color: #0052ff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.new-category button:hover {
  background-color: #003cb3;
}
</style>
