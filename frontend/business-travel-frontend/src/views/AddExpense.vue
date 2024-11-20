<template>
  <div class="add-expense">
    <header class="header">
      <h1>Stroški</h1>
    </header>
    <main class="form-container">
      <form @submit.prevent="submitExpense">
        <div class="form-group">
          <label for="description">Naziv stroška</label>
          <input
              type="text"
              id="description"
              v-model="description"
              required
          />
        </div>
        <div class="form-group">
          <label for="amount">Znesek</label>
          <input
              type="number"
              id="amount"
              v-model="amount"
              step="0.01"
              required
          />
        </div>
        <div class="form-group">
          <label for="category">Kategorija</label>
          <input
              type="text"
              id="category"
              v-model="category"
              required
          />
        </div>
        <div class="form-group">
          <label for="trip">Poslovno potovanje</label>
          <select id="trip" v-model="selectedTrip">
            <option v-for="trip in trips" :key="trip.id" :value="trip.id">
              {{ trip.destination }}
            </option>
          </select>
        </div>
        <button type="submit" class="submit-button">Dodaj strošek</button>
      </form>
    </main>
  </div>
</template>

<script>
export default {
  data() {
    return {
      description: "",
      amount: "",
      category: "",
      selectedTrip: null,
      trips: [
        { id: 1, destination: "London" },
        { id: 2, destination: "Paris" },
      ],
    };
  },
  methods: {
    submitExpense() {
      // Emit or save the expense data
      const newExpense = {
        description: this.description,
        amount: parseFloat(this.amount),
        category: this.category,
        tripId: this.selectedTrip,
      };
      console.log("Expense submitted: ", newExpense);
      // Reset the form
      this.description = "";
      this.amount = "";
      this.category = "";
      this.selectedTrip = null;
    },
  },
};
</script>

<style scoped>
.add-expense {
  background: #333333;
  color: #ffffff;
  min-height: 100vh;
}

.header {
  background: #4a90e2;
  padding: 1rem;
  text-align: left;
}

.header h1 {
  color: white;
  margin: 0;
  font-size: 1.5rem;
}

.form-container {
  background: #eeeeee;
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
  background: #4a90e2;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-button:hover {
  background: #357ab8;
}
</style>
