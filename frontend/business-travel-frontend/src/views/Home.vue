<template>
  <div>
    <!-- Header Section -->
    <div class="header">
      <h1>Dobrodošel Janez Novak</h1>
    </div>

    <!-- Content Section with Navigation Panels -->
    <div class="content">
      <div class="panel" @click="goToTravels">
        <img src="/src/assets/Corporate_Travel_Policy_1200x600.png" alt="Travels" />
        <h3>POTOVANJA</h3>
        <p>Dodajanje in urejanje potovanj</p>
        <button>Go to Travels</button>
      </div>

      <div class="panel" @click="goToExpenses">
        <img src="/src/assets/expense.png" alt="Expenses" />
        <h3>STROŠKI</h3>
        <p>Dodajanje in urejanje stroškov</p>
        <button>Go to Expenses</button>
      </div>

      <div class="panel" @click="goToChart">
        <img src="/src/assets/chart.png" alt="Chart" />
        <h3>GRAFI STROŠKOV</h3>
        <p>Pregled stroškov na grafih</p>
        <button>Go to Chart</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomePage",
  methods: {
    goToTravels() {
      this.$router.push("/trips");
    },
    goToExpenses() {
      this.$router.push("/expenses");
    },
    goToChart() {
      this.$router.push("/statistics");
    }
  }
};
</script>

<style scoped>
/* Header Section */
.header {
  background-color: #3B4FC7;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header h1 {
  color: white;
  font-size: 20px;
}

/* Content Section with Navigation Panels */
.content {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin: 20px;
}

.panel {
  background-color: #F3F3F3;
  border-radius: 10px;
  padding: 10px;
  text-align: center;
  cursor: pointer;
}

.panel img {
  width: 131px;
  height: 112px;
}

.panel h3 {
  font-size: 13px;
  font-weight: bold;
}

.panel p {
  font-size: 10px;
  color: gray;
}

.panel button {
  margin-top: 10px;
  padding: 10px;
  width: 120px;
}
</style>
