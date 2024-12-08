<template>
  <div class="add-trip">
    <header class="header">
      <h1>Potovanja</h1>
    </header>
    <main class="form-container">
      <form @submit.prevent="submitTrip">
        <div class="form-group">
          <label for="destination">Destinacija</label>
          <input
              type="text"
              id="destination"
              v-model="destination"
              required
          />
        </div>
        <div class="form-group">
          <label for="start-date">Datum začetka</label>
          <input
              type="date"
              id="start-date"
              v-model="startDate"
              required
          />
        </div>
        <div class="form-group">
          <label for="end-date">Datum konca</label>
          <input
              type="date"
              id="end-date"
              v-model="endDate"
              required
          />
        </div>
        <div class="form-group">
          <label for="purpose">Namen potovanja</label>
          <input
              type="text"
              id="purpose"
              v-model="purpose"
              required
          />
        </div>
        <button type="submit" class="submit-button">Dodaj potovanje</button>
      </form>
    </main>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      destination: "",
      startDate: "",
      endDate: "",
      purpose: "",
    };
  },
  methods: {
    async submitTrip() {
      console.log("Destination:", this.destination);
      console.log("Start Date:", this.startDate);
      console.log("End Date:", this.endDate);
      console.log("Purpose:", this.purpose);

      const newTrip = {
        destination: this.destination,
        startDate: this.startDate,
        endDate: this.endDate,
        purpose: this.purpose,
      };
      console.log("Trip submitted to backend:", newTrip);
      try {
        const response = await axios.post("http://localhost:3000/api/trips", newTrip);
        console.log("Backend Response:", response.data);

        // Reset form
        this.destination = "";
        this.startDate = "";
        this.endDate = "";
        this.purpose = "";
      } catch (error) {
        console.error("Error adding trip:", error.response?.data || error.message);
      }
    },
  }
}
</script>

<style scoped>
.add-trip {
  background: #333333;
  color: #ffffff;
  min-height: 100vh;
}

.header {
  background: #800000;
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

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  background: #800000;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 1rem;
}

.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
  color: black; /* This will change the label color to black */
}


.submit-button:hover {
  background: #a00000;
}
</style>
