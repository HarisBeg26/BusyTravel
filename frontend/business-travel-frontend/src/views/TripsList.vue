<template>
  <div class="trip-list-window">
    <!-- Header Section -->
    <div class="header">
      <span>{{ $t('tripsHeader') }}</span>
    </div>

    <!-- Main Content Section -->
    <div class="main-content">
      <!-- Sidebar Section -->
      <div class="sidebar">
        <button @click="redirectToAddTravel" class="btn-add">{{ $t('newTrip') }}</button>
        <button @click="deleteTravel" class="btn-delete">{{ $t('deleteTrip') }}</button>

        <!-- List of Trips -->
        <ul>
          <li
              v-for="trip in trips"
              :key="trip.id"
              @click="selectTrip(trip)"
              :class="{ selected: selectedTrip.id === trip.id }"
          >
            {{ trip.destination }}
          </li>
        </ul>
      </div>

      <!-- Detail Panel Section -->
      <div class="detail-panel" v-if="selectedTrip.id">
        <h2>{{ $t('tripDetails') }}</h2>
        <div class="details">
          <div>
            <label for="purpose">{{ $t('tripName') }}</label>
            <input v-model="selectedTrip.purpose" id="purpose" type="text" />
          </div>
          <div>
            <label for="startDate">{{ $t('startDate') }}</label>
            <input v-model="selectedTrip.startDate" id="startDate" type="date" />
          </div>
          <div>
            <label for="destination">{{ $t('destination') }}</label>
            <input v-model="selectedTrip.destination" id="destination" type="text" />
          </div>
          <div>
            <label for="endDate">{{ $t('endDate') }}</label>
            <input v-model="selectedTrip.endDate" id="endDate" type="date" />
          </div>
          <button @click="editTravel" class="btn-edit">{{ $t('editTrip') }}</button>
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
      selectedTrip: { // Ensure this object is defined with default values
        id: null,
        purpose: '',
        destination: '',
        startDate: '',
        endDate: ''
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
        const response = await axios.get('http://localhost:3000/api/trips');
        this.trips = response.data; // Populate trips data from API response
      } catch (error) {
        console.error("Error fetching trips:", error);
      }
    },

    selectTrip(trip) {
      this.selectedTrip = { ...trip };  // Make sure the trip object is copied to selectedTrip
    },

    redirectToAddTravel() {
      this.$router.push('/add-trip'); // Redirect to the Add Trip page
    },

    async deleteTravel() {
      if (this.selectedTrip.id) {
        // Call API to delete the selected trip
        await axios.delete(`http://localhost:3000/api/trips/${this.selectedTrip.id}`)
            .then(() => {
              // Remove the deleted trip from the local trips list
              this.trips = this.trips.filter(trip => trip.id !== this.selectedTrip.id);
              this.selectedTrip = { id: null, purpose: '', destination: '', startDate: '', endDate: '' }; // Reset selected trip
            })
            .catch(error => {
              console.error("Error deleting trip:", error);
            });
      }
    },

    async editTravel() {
      if (this.selectedTrip.id) {
        try {
          const updatedTrip = {
            ...this.selectedTrip,
            start_date: this.selectedTrip.startDate || null,
            end_date: this.selectedTrip.endDate || null,
          };
          const response = await axios.put(
              `http://localhost:3000/api/trips/${this.selectedTrip.id}`,
              updatedTrip
          );
          console.log("Response:", response.data);

          // Update the trips list locally
          const updatedTripIndex = this.trips.findIndex(trip => trip.id === this.selectedTrip.id);
          if (updatedTripIndex !== -1) {
            this.trips.splice(updatedTripIndex, 1, response.data);
          }
        } catch (error) {
          console.error("Error editing trip:", error);
        }
      }
    }
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

.selected {
  background-color: #800000;
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
  color:#333;
}

.sidebar li:hover {
  background-color: #ddd;
  color:#000;
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
