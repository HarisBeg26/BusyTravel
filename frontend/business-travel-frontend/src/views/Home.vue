

<template>
<div class="main-page">
  <div class="header">
    <h1>Dobrodošel Janez Novak</h1>
  </div>

  <div class="grid">
    <div class="panel" @click="goToTrips">
      <img src="@/assets/Corporate_Travel_Policy_1200x600.png" alt="Travel"/>
      <h2>POTOVANJA</h2>
      <p>Dodajanje in urejanje potovanj</p>
      <button class="nav-btn">Go to Travels</button>
    </div>

    <div class="panel" @click="goToExpenses">
      <img src="@/assets/expense.png" alt="Expenses" />
      <h2>STROŠKI</h2>
      <p>Dodajanje in urejanje stroškov</p>
      <button class="nav-btn">Go to Expenses</button>
    </div>

    <div class="panel" @click="goToChart">
      <img src="@/assets/chart.png" alt="ExpensesChart" />
      <h2>GRAFI STROŠKOV</h2>
      <p>Pregled stroškov na grafih</p>
      <button class="nav-btn">Go to Chart</button>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name:"Home",
  methods: {
    goToTrips(){
      this.$router.push({name:'Trips'});
    },
    goToExpenses(){
      this.$router.push({name:'Expenses'});
    },
    goToChart(){
      this.$router.push({name:'Chart'});
    }
  }
};
</script>
<style scoped>
.main-page {
  font-family: Arial, sans-serif;
}

.header {
  background-color:#3B4FC7;
  color: white;
  text-align: center;
  padding: 20px;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap:20px;
  margin-top:50px;
}

.panel {
  background-color:#F3F3F3;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  cursor:pointer;
}

.panel img {
  width: 131px;
  height:112px;
  object-fit: cover;
  margin-bottom:15px;
}

.panel h2 {
  font-size: 16px;
  font-weight:bold;
}

.panel p {
  font-size: 12px;
  color: gray;
}

.nav-btn {
  background-color: #4A90E2;
  color:white;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius:5px;
  cursor:pointer;
}

.nav-btn:hover {
  background-color:#357ABD;
}
</style>