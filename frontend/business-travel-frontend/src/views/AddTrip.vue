<template>
  <div class="add-trip">
    <header class="header">
      <h1>{{ $t('tripsHeader') }}</h1>
    </header>
    <main class="form-container">
      <form @submit.prevent="submitTrip">
        <div class="form-group">
          <label for="destination">{{ $t('destination') }}</label>
          <input
              type="text"
              id="destination"
              v-model="destination"
              required
          />
        </div>
        <div class="form-group">
          <label for="start-date">{{ $t('startDate') }}</label>
          <input
              type="date"
              id="start-date"
              v-model="startDate"
              required
          />
        </div>
        <div class="form-group">
          <label for="end-date">{{ $t('endDate') }}</label>
          <input
              type="date"
              id="end-date"
              v-model="endDate"
              required
          />
        </div>
        <div class="form-group">
          <label for="purpose">{{ $t('tripName') }}</label>
          <input
              type="text"
              id="purpose"
              v-model="purpose"
              required
          />
        </div>
        <button type="submit" class="submit-button">{{ $t('addTrip') }}</button>
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
      const newTrip = {
        destination: this.destination,
        startDate: this.startDate,
        endDate: this.endDate,
        purpose: this.purpose,
      };
      try {
        const response = await axios.post("http://localhost:3000/api/trips", newTrip);
        console.log("Backend Response:", response.data);

        // Reset form after successful submission
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

.submit-button:hover {
  background: #a00000;
}
</style>
