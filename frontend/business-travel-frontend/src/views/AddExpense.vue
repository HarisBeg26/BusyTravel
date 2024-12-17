<template>
  <div class="add-expense">
    <header class="header">
      <h1>{{ $t('addExpense') }}</h1>
    </header>
    <main class="form-container">
      <form @submit.prevent="submitExpense">
        <div class="form-group">
          <label for="description">{{ $t('expenseDescription') }}</label>
          <input
              type="text"
              id="description"
              v-model="expense.description"
              required
          />
        </div>
        <div class="form-group">
          <label for="amount">{{ $t('amount') }}</label>
          <input
              type="number"
              id="amount"
              v-model="expense.amount"
              step="0.01"
              required
          />
        </div>
        <div class="form-group">
          <label for="category">{{ $t('category') }}</label>
          <input
              type="text"
              id="category"
              v-model="expense.category"
              required
          />
        </div>
        <div class="form-group">
          <label for="tripId">{{ $t('businessTrip') }}</label>
          <select v-model="expense.trip_id" id="tripId">
            <option v-for="trip in trips" :key="trip.id" :value="trip.id">
              {{ trip.destination }}
            </option>
          </select>
        </div>
        <button type="submit" class="submit-button">{{ $t('save') }}</button>
      </form>
      <div v-if="error" class="error">{{ error }}</div>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      expense: {
        description: '',
        amount: '',
        category: '',
        trip_id: null,
      },
      trips: [], // Store trips here
      error: null, // Store error messages
    };
  },
  mounted() {
    this.fetchTrips(); // Fetch trips when component is mounted
  },
  methods: {
    async fetchTrips() {
      try {
        const response = await axios.get('http://localhost:3000/api/trips');
        this.trips = response.data;
      } catch (error) {
        this.error = error.message;
      }
    },
    async submitExpense() {
      try {
        const response = await axios.post('http://localhost:3000/api/expenses', this.expense);
        console.log('Expense added:', response.data);
        this.$router.push('/expenses'); // Redirect to expenses list after adding
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    },
  },
};
</script>

<style scoped>
.add-expense {
  background: #f0f8ff; /* Light Blue */
  color: #333;
  min-height: 100vh;
}

.header {
  background: #4682b4; /* Steel Blue */
  padding: 1rem;
  text-align: left;
}

.header h1 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.form-container {
  background: #ffffff;
  margin: 20px;
  padding: 20px;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  background: #4682b4; /* Steel Blue */
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 10px;
}

.submit-button:hover {
  background: #5f9ea0; /* Light Steel Blue */
}

.submit-button:active {
  background: #3b7fa5; /* Darker Steel Blue */
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
