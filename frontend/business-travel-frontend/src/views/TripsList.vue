<template>
  <div class="trip-list-window">
    <!-- Header Section -->
    <div class="header">
      <span>Potovanja</span>
    </div>

    <!-- Main Content Section -->
    <div class="main-content">
      <!-- Sidebar Section -->
      <div class="sidebar">
        <button @click="redirectToAddTravel" class="btn-add">Novo potovanje</button>
        <button @click="deleteTravel" class="btn-delete">Izbriši potovanje</button>

        <!-- List of Trips -->
        <ul>
          <li v-for="trip in trips" :key="trip.id" @click="selectTrip(trip)">
            {{ trip.destination }}
          </li>
        </ul>
      </div>

      <!-- Detail Panel Section -->
      <div class="detail-panel">
        <h2>Podrobnosti potovanja</h2>
        <div class="details">
          <div>
            <label for="purpose">Ime potovanja:</label>
            <input v-model="selectedTrip.purpose" id="purpose" type="text" />
          </div>
          <div>
            <label for="startDate">Datum začetka:</label>
            <input v-model="selectedTrip.startDate" id="startDate" type="date" />
          </div>
          <div>
            <label for="destination">Destinacija:</label>
            <input v-model="selectedTrip.destination" id="destination" type="text" />
          </div>
          <div>
            <label for="endDate">Datum konca:</label>
            <input v-model="selectedTrip.endDate" id="endDate" type="date" />
          </div>
          <button @click="editTravel" class="btn-edit">Uredi</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'; // Make sure axios is installed

export default {
  data() {
    return {
      trips: [], // Initially empty, will be populated from API
      selectedTrip: {
        purpose: '',
        destination: '',
        startDate: '',
        endDate: '',
      },
    };
  },
  mounted() {
    // Fetch trips data when component is mounted
    this.fetchTrips();
  },
  methods: {
    async fetchTrips() {
      try {
        const response = await axios.get('https://your-api-endpoint.com/trips');
        this.trips = response.data; // Populate trips data from API response
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    },
    selectTrip(trip) {
      this.selectedTrip = { ...trip }; // Populate selected trip's details
    },
    redirectToAddTravel() {
      this.$router.push('/add-trip'); // Redirect to the Add Trip page
    },
    deleteTravel() {
      if (this.selectedTrip.id) {
        // Call API to delete the selected trip
        axios.delete(`https://your-api-endpoint.com/trips/${this.selectedTrip.id}`)
            .then(() => {
              // Remove the deleted trip from the local trips list
              this.trips = this.trips.filter(trip => trip.id !== this.selectedTrip.id);
              this.selectedTrip = { purpose: '', destination: '', startDate: '', endDate: '' }; // Reset selected trip
            })
            .catch(error => {
              console.error("Error deleting trip:", error);
            });
      }
    },
    editTravel() {
      if (this.selectedTrip.id) {
        // Call API to update the trip
        axios.put(`https://your-api-endpoint.com/trips/${this.selectedTrip.id}`, this.selectedTrip)
            .then(response => {
              // Optionally update the trip list with the updated data
              const updatedTripIndex = this.trips.findIndex(trip => trip.id === this.selectedTrip.id);
              if (updatedTripIndex !== -1) {
                this.trips[updatedTripIndex] = response.data;
              }
            })
            .catch(error => {
              console.error("Error editing trip:", error);
            });
      }
    },
  },
};
</script>

<style scoped>
.trip-list-window {
  font-family: Arial, sans-serif;
  background-color: #333333;
  color: white;
  height: 100vh;
}

.header {
  background-color: #800000;
  padding: 15px;
  text-align: left;
  font-size: 20px;
}

.main-content {
  display: flex;
  margin: 20px;
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
  background-color: #800000;
  color: white;
  border: none;
  cursor: pointer;
}
</style>
