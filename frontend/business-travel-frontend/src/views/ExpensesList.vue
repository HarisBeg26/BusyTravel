<template>
  <div class="expense-list-window">
    <!-- Header Section -->
    <div class="header">
      <span>{{ $t('expenses') }}</span>
    </div>

    <!-- Main Content Section -->
    <div class="main-content">
      <!-- Sidebar Section -->
      <div class="sidebar">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="Search expenses..."
            class="search-bar"
        />
        <button @click="redirectToAddExpense" class="btn-add">{{ $t('newExpense') }}</button>
        <button @click="deleteExpense" class="btn-delete">{{ $t('deleteExpense') }}</button>

        <!-- List of Expenses -->
        <ul>
          <li
              v-for="expense in filteredExpenses"
              :key="expense.id"
              @click="selectExpense(expense)"
              :class="{ selected: selectedExpense.id === expense.id }"
          >
            {{ expense.description }}
          </li>
        </ul>
      </div>

      <!-- Detail Panel Section -->
      <div class="detail-panel">
        <h2>{{ $t('expenseDetails') }}</h2>
        <div class="details">
          <div>
            <label for="description">{{ $t('expenseDescription') }}</label>
            <input v-model="selectedExpense.description" id="description" type="text" />
          </div>
          <div>
            <label for="amount">{{ $t('amount') }}</label>
            <input v-model="selectedExpense.amount" id="amount" type="number" step="0.01" />
          </div>
          <div>
            <label for="category">{{ $t('category') }}</label>
            <input v-model="selectedExpense.category" id="category" type="text" />
          </div>
          <div>
            <label for="tripId">{{ $t('tripId') }}</label>
            <input v-model="selectedExpense.trip_id" id="tripId" type="number" />
          </div>
          <button @click="editExpense" class="btn-edit">{{ $t('editExpense') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      expenses: [], // Initially empty, will be populated from API
      selectedExpense: {
        description: '',
        amount: '',
        category: '',
        trip_id: null,
      },
      searchQuery: '', // For the search bar
    };
  },
  mounted() {
    // Fetch expenses when component is mounted
    this.fetchExpenses();
  },
  computed: {
    filteredExpenses() {
      // Filter expenses based on searchQuery (case-insensitive)
      return this.expenses.filter(expense => {
        const description = expense.description.toLowerCase();
        return description.includes(this.searchQuery.toLowerCase());
      });
    },
  },
  methods: {
    async fetchExpenses() {
      try {
        const response = await axios.get('http://localhost:3000/api/expenses');
        console.log("Fetched expenses:", response.data);
        this.expenses = response.data;
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    },
    selectExpense(expense) {
      this.selectedExpense = { ...expense };
      console.log("Selected expense:", this.selectedExpense);
    },
    redirectToAddExpense() {
      this.$router.push('/add-expense'); // Redirect to Add Expense page
    },
    async deleteExpense() {
      if (this.selectedExpense.id) {
        try {
          await axios.delete(`http://localhost:3000/api/expenses/${this.selectedExpense.id}`);
          this.expenses = this.expenses.filter(expense => expense.id !== this.selectedExpense.id);
          this.selectedExpense = { description: '', amount: '', category: '', trip_id: null };
        } catch (error) {
          console.error("Error deleting expense:", error);
        }
      }
    },
    async editExpense() {
      if (this.selectedExpense.id) {
        try {
          const updatedExpense = { ...this.selectedExpense };
          const response = await axios.put(
              `http://localhost:3000/api/expenses/${this.selectedExpense.id}`,
              updatedExpense
          );
          console.log("Updated expense:", response.data);

          const updatedExpenseIndex = this.expenses.findIndex(exp => exp.id === this.selectedExpense.id);
          if (updatedExpenseIndex !== -1) {
            this.expenses.splice(updatedExpenseIndex, 1, response.data);
          }
        } catch (error) {
          console.error("Error editing expense:", error);
        }
      }
    },
  },
};
</script>

<style scoped>
.expense-list-window {
  font-family: Arial, sans-serif;
  background-color: #333333;
  color: white;
  height: 100vh;
}

.header {
  background-color: #0077b6; /* Light Blue */
  padding: 15px;
  text-align: left;
  font-size: 20px;
}

.main-content {
  display: flex;
  margin: 20px;
}

.selected {
  background-color: #0077b6; /* Light Blue */
  color: white;
}

.sidebar {
  width: 200px;
  background-color: #f5f5f5;
  padding: 10px;
}

.sidebar button {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  font-size: 14px;
  cursor: pointer;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  cursor: pointer;
  padding: 5px 0;
  color: #333;
}

.sidebar li:hover {
  background-color: #ddd;
  color: #000;
}

.detail-panel {
  flex: 1;
  background-color: #eeeeee;
  padding: 20px;
}

.detail-panel h2 {
  font-size: 18px;
  font-weight: bold;
}

.details {
  margin-top: 20px;
}

.details label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

.details input {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
}

.details button {
  width: 100%;
  padding: 10px;
  background-color: #0077b6; /* Light Blue */
  color: white;
  border: none;
  cursor: pointer;
}

.details button:hover {
  background-color: #005f8a; /* Darker Blue */
}

.search-bar {
  width: 100%;
  padding: 8px;
  margin-bottom: 15px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>