<template>
  <div class="trips-list-b-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1>{{ $t('tripsList') || 'Seznam potovanj' }}</h1>
      <Button :label="$t('addTrip')" icon="pi pi-plus" @click="redirectToAddTrip" class="p-button-raised p-button-success" />
    </div>

    <!-- Search and Filter -->
    <div class="filter-bar">
      <IconField iconPosition="left">
        <InputIcon class="pi pi-search"></InputIcon>
        <InputText v-model="searchQuery" :placeholder="$t('searchByDestination') || 'Išči po destinaciji...'" />
      </IconField>
    </div>

    <!-- Trips Grid -->
    <div v-if="loading" class="loading-spinner">
      <ProgressSpinner />
    </div>
    <div v-else-if="filteredTrips.length > 0" class="trips-grid">
      <Card v-for="trip in filteredTrips" :key="trip.id" class="trip-card">
        <template #header>
          <div class="card-header" :style="{ backgroundImage: `url(${getBackgroundImage(trip.destination)})` }">
            <div class="header-overlay">
              <h2 class="trip-destination">{{ trip.destination }}</h2>
            </div>
          </div>
        </template>
        <template #content>
          <p class="trip-purpose">{{ trip.purpose }}</p>
          <div class="trip-dates">
            <i class="pi pi-calendar"></i>
            <span>{{ formatDate(trip.startDate) }} - {{ formatDate(trip.endDate) }}</span>
          </div>
        </template>
        <template #footer>
          <div class="card-actions">
            <Button icon="pi pi-pencil" class="p-button-text p-button-warning" @click="editTrip(trip)" />
            <Button icon="pi pi-trash" class="p-button-text p-button-danger" @click="confirmDelete(trip)" />
            <Button :label="$t('details')" icon="pi pi-info-circle" class="p-button-outlined p-button-sm" @click="viewTripDetails(trip)" />
          </div>
        </template>
      </Card>
    </div>
    <div v-else class="no-trips-message">
      <p>{{ $t('noTripsFound') || 'Ni najdenih potovanj.' }}</p>
    </div>

    <!-- Modals -->
    <EditTripModal :visible.sync="isEditModalVisible" :trip="selectedTrip" @trip-updated="fetchTrips" />
    <DeleteConfirmationModal :visible.sync="isDeleteModalVisible" :item="selectedTrip" itemType="trip" @delete-confirmed="deleteTrip" />
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Card from 'primevue/card';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import ProgressSpinner from 'primevue/progressspinner';
import EditTripModal from '@/components/modals/EditTripModal.vue';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal.vue';
import abTestingService from '@/services/abTestingService.js';

export default {
  name: "TripsListBPage",
  components: {
    Card,
    Button,
    InputText,
    IconField,
    InputIcon,
    ProgressSpinner,
    EditTripModal,
    DeleteConfirmationModal
  },
  setup() {
    const router = useRouter();
    const trips = ref([]);
    const loading = ref(true);
    const searchQuery = ref('');
    const selectedTrip = ref(null);
    const isEditModalVisible = ref(false);
    const isDeleteModalVisible = ref(false);

    const fetchTrips = async () => {
      try {
        loading.value = true;
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips`);
        trips.value = response.data;
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        loading.value = false;
      }
    };

    onMounted(fetchTrips);

    const filteredTrips = computed(() => {
      if (!searchQuery.value) {
        return trips.value;
      }
      return trips.value.filter(trip =>
        trip.destination.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const redirectToAddTrip = () => {
      abTestingService.trackButtonClick('add_trip', 'trips');
      router.push('/add-trip');
    };

    const editTrip = (trip) => {
      selectedTrip.value = trip;
      isEditModalVisible.value = true;
      abTestingService.trackButtonClick('edit_trip', 'trips');
    };

    const confirmDelete = (trip) => {
      selectedTrip.value = trip;
      isDeleteModalVisible.value = true;
      abTestingService.trackButtonClick('delete_trip_confirm', 'trips');
    };

    const deleteTrip = async () => {
      if (!selectedTrip.value) return;
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/trips/${selectedTrip.value.id}`);
        fetchTrips(); // Refresh list
        abTestingService.trackEvent('trip_deleted', { tripId: selectedTrip.value.id });
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    };
    
    const viewTripDetails = (trip) => {
        // Placeholder for future implementation
        console.log("Viewing details for trip:", trip.id);
        abTestingService.trackButtonClick('view_trip_details', 'trips');
    };

    const getBackgroundImage = (destination) => {
      // Simple logic to get a placeholder image. In a real app, you might use an API like Unsplash.
      const keywords = ['travel', 'city', 'nature', 'business'];
      const keyword = keywords[Math.floor(Math.random() * keywords.length)];
      return `https://source.unsplash.com/400x200/?${destination},${keyword}`;
    };

    return {
      trips,
      loading,
      searchQuery,
      filteredTrips,
      selectedTrip,
      isEditModalVisible,
      isDeleteModalVisible,
      formatDate,
      redirectToAddTrip,
      editTrip,
      confirmDelete,
      deleteTrip,
      viewTripDetails,
      getBackgroundImage
    };
  }
};
</script>

<style scoped>
.trips-list-b-page {
  padding: 2rem;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filter-bar {
  margin-bottom: 2rem;
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.trip-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.trip-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.card-header {
  height: 150px;
  background-size: cover;
  background-position: center;
  position: relative;
}

.header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: flex-end;
  padding: 1rem;
}

.trip-destination {
  color: white;
  font-size: 1.5rem;
  margin: 0;
}

.trip-purpose {
  font-style: italic;
  color: #6c757d;
}

.trip-dates {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #495057;
  margin-top: 1rem;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.loading-spinner, .no-trips-message {
  text-align: center;
  padding: 4rem;
}
</style>
