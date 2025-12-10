<template>
  <div class="trips-page-b">
    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb-container">
      <Breadcrumb :model="breadcrumbItems" class="custom-breadcrumb">
        <template #item="{ item }">
          <router-link v-if="item.route" :to="item.route" class="breadcrumb-link">
            <i :class="item.icon" v-if="item.icon"></i>
            {{ item.label }}
          </router-link>
          <span v-else>
            <i :class="item.icon" v-if="item.icon"></i>
            {{ item.label }}
          </span>
        </template>
      </Breadcrumb>
    </div>

    <div class="trips-container">
      <!-- Header with simplified design -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">{{ $t('tripsHeader') }}</h1>
          <p class="trips-count">{{ filteredTrips.length }} {{ $t('totalTrips') }}</p>
        </div>
        <div class="header-actions">
          <Button
            :label="$t('newTrip')"
            icon="pi pi-plus"
            @click="redirectToAddTravel"
            class="add-trip-button"
          />
        </div>
      </div>

      <!-- Simplified Search and Filter -->
      <div class="search-filter-section">
        <div class="search-wrapper">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              :placeholder="$t('Search') + ' trips...'"
              class="search-input"
            />
          </IconField>
        </div>
        <div class="filter-wrapper">
          <Dropdown
            v-model="selectedFilter"
            :options="filterOptions"
            optionLabel="label"
            optionValue="value"
            :placeholder="$t('filterBy')"
            class="filter-dropdown"
          />
        </div>
      </div>

      <!-- Card View Layout (Alternative to Table) -->
      <div class="trips-grid" v-if="filteredTrips.length > 0">
        <div 
          v-for="trip in paginatedTrips" 
          :key="trip.id"
          class="trip-card"
          @click="selectTrip(trip)"
        >
          <div class="trip-card-header">
            <div class="destination-info">
              <i class="pi pi-map-marker location-icon"></i>
              <h3 class="destination-name">{{ trip.destination }}</h3>
            </div>
            <div class="trip-actions">
              <Button
                icon="pi pi-pencil"
                @click.stop="editTrip(trip)"
                class="action-button edit-button"
                size="small"
                text
              />
              <Button
                icon="pi pi-trash"
                @click.stop="deleteTrip(trip)"
                class="action-button delete-button"
                size="small"
                text
              />
            </div>
          </div>

          <div class="trip-card-body">
            <div class="trip-detail">
              <span class="detail-label">{{ $t('purpose') }}:</span>
              <span class="detail-value">{{ trip.purpose }}</span>
            </div>
            
            <div class="date-range">
              <div class="date-item start-date">
                <i class="pi pi-calendar"></i>
                <div class="date-info">
                  <span class="date-label">{{ $t('startDate') }}</span>
                  <span class="date-value">{{ formatDate(trip.startDate) }}</span>
                </div>
              </div>
              
              <div class="date-separator">
                <i class="pi pi-arrow-right"></i>
              </div>
              
              <div class="date-item end-date">
                <i class="pi pi-calendar"></i>
                <div class="date-info">
                  <span class="date-label">{{ $t('endDate') }}</span>
                  <span class="date-value">{{ formatDate(trip.endDate) }}</span>
                </div>
              </div>
            </div>
            
            <div class="trip-status">
              <Tag 
                :value="getTripStatus(trip)" 
                :severity="getStatusSeverity(trip)"
                class="status-tag"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="pi pi-map-marker"></i>
        </div>
        <h3>{{ $t('noTripsFound') }}</h3>
        <p>{{ $t('noTripsMessage') }}</p>
        <Button
          :label="$t('addFirstTrip')"
          icon="pi pi-plus"
          @click="redirectToAddTravel"
          class="add-first-button"
        />
      </div>

      <!-- Custom Pagination -->
      <div class="pagination-section" v-if="filteredTrips.length > itemsPerPage">
        <Paginator
          :first="first"
          :rows="itemsPerPage"
          :totalRecords="filteredTrips.length"
          @page="onPageChange"
          class="custom-paginator"
        />
      </div>
    </div>

    <!-- Edit Trip Modal -->
    <EditTripModal
      v-if="showEditModal"
      :trip="selectedTrip"
      @close="closeEditModal"
      @updated="handleTripUpdated"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-if="showDeleteModal"
      :tripToDelete="tripToDelete"
      @close="closeDeleteModal"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script>
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import Paginator from 'primevue/paginator';
import EditTripModal from '@/components/modals/EditTripModal.vue';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal.vue';
import axios from 'axios';

export default {
  name: "TripsBListPage",
  components: {
    Button,
    Breadcrumb,
    InputText,
    IconField,
    InputIcon,
    Dropdown,
    Tag,
    Paginator,
    EditTripModal,
    DeleteConfirmationModal
  },
  data() {
    return {
      trips: [],
      searchQuery: '',
      selectedFilter: 'all',
      selectedTrip: null,
      loading: false,
      showEditModal: false,
      showDeleteModal: false,
      tripToDelete: null,
      first: 0,
      itemsPerPage: 6,
      breadcrumbItems: [
        {
          label: this.$t('Home') || 'Home',
          icon: 'pi pi-home',
          route: '/'
        },
        {
          label: this.$t('Trips') || 'Trips',
          icon: 'pi pi-map-marker'
        }
      ],
      filterOptions: [
        { label: 'All Trips', value: 'all' },
        { label: 'Active Trips', value: 'active' },
        { label: 'Completed Trips', value: 'completed' },
        { label: 'Upcoming Trips', value: 'upcoming' }
      ]
    }
  },
  computed: {
    filteredTrips() {
      let filtered = this.trips;

      // Apply search filter
      if (this.searchQuery) {
        filtered = filtered.filter(trip =>
          trip.destination.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          trip.purpose.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // Apply status filter
      if (this.selectedFilter !== 'all') {
        filtered = filtered.filter(trip => {
          const status = this.getTripStatus(trip);
          return status.toLowerCase() === this.selectedFilter;
        });
      }

      return filtered;
    },
    paginatedTrips() {
      const start = this.first;
      const end = start + this.itemsPerPage;
      return this.filteredTrips.slice(start, end);
    }
  },
  async mounted() {
    await this.fetchTrips();
  },
  methods: {
    async fetchTrips() {
      this.loading = true;
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips`);
        this.trips = response.data;
      } catch (error) {
        console.error('Error fetching trips:', error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load trips',
          life: 3000
        });
      } finally {
        this.loading = false;
      }
    },
    selectTrip(trip) {
      this.selectedTrip = trip;
      // Could navigate to trip details page here
    },
    editTrip(trip) {
      this.selectedTrip = trip;
      this.showEditModal = true;
    },
    deleteTrip(trip) {
      this.tripToDelete = trip;
      this.showDeleteModal = true;
    },
    redirectToAddTravel() {
      this.$router.push('/add-trip');
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedTrip = null;
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.tripToDelete = null;
    },
    async confirmDelete() {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/trips/${this.tripToDelete.id}`);
        await this.fetchTrips();
        this.closeDeleteModal();
        this.$toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Trip deleted successfully',
          life: 3000
        });
      } catch (error) {
        console.error('Error deleting trip:', error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete trip',
          life: 3000
        });
      }
    },
    handleTripUpdated() {
      this.fetchTrips();
      this.closeEditModal();
    },
    onPageChange(event) {
      this.first = event.first;
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString(this.$i18n.locale);
    },
    getTripStatus(trip) {
      const now = new Date();
      const startDate = new Date(trip.startDate);
      const endDate = new Date(trip.endDate);

      if (now < startDate) {
        return 'upcoming';
      } else if (now > endDate) {
        return 'completed';
      } else {
        return 'active';
      }
    },
    getStatusSeverity(trip) {
      const status = this.getTripStatus(trip);
      switch (status) {
        case 'active': return 'success';
        case 'completed': return 'info';
        case 'upcoming': return 'warning';
        default: return 'info';
      }
    }
  }
};
</script>

<style scoped>
.trips-page-b {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.breadcrumb-container {
  background: rgba(255, 255, 255, 0.9);
  padding: 1rem 2rem;
  border-bottom: 1px solid #e0e6ed;
}

.custom-breadcrumb {
  background: transparent;
  border: none;
  padding: 0;
}

.breadcrumb-link {
  color: #6c757d;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.trips-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.header-left {
  flex: 1;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.trips-count {
  color: #6c757d;
  font-size: 1rem;
  margin: 0;
}

.add-trip-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  color: white;
  border-radius: 12px;
  padding: 0.875rem 1.5rem;
  font-weight: 600;
  font-size: 1rem;
}

.search-filter-section {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.search-wrapper {
  flex: 2;
}

.filter-wrapper {
  flex: 1;
}

.search-input, .filter-dropdown {
  width: 100%;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 0.875rem 1rem;
  font-size: 1rem;
}

.search-input:focus, .filter-dropdown:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.trips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.trip-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #f1f3f4;
}

.trip-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.trip-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.destination-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.location-icon {
  font-size: 1.25rem;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.destination-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.trip-actions {
  display: flex;
  gap: 0.25rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.trip-card:hover .trip-actions {
  opacity: 1;
}

.action-button {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
}

.edit-button {
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.delete-button {
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
}

.trip-card-body {
  space-y: 1rem;
}

.trip-detail {
  display: flex;
  margin-bottom: 1rem;
}

.detail-label {
  font-weight: 600;
  color: #6c757d;
  margin-right: 0.5rem;
}

.detail-value {
  color: #2c3e50;
  font-weight: 500;
}

.date-range {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1rem 0;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 12px;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.date-item i {
  color: #667eea;
  font-size: 1rem;
}

.date-info {
  display: flex;
  flex-direction: column;
}

.date-label {
  font-size: 0.75rem;
  color: #6c757d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.date-value {
  font-weight: 600;
  color: #2c3e50;
}

.date-separator {
  color: #adb5bd;
  font-size: 0.875rem;
}

.trip-status {
  margin-top: 1rem;
}

.status-tag {
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 4rem;
  color: #adb5bd;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6c757d;
  margin-bottom: 2rem;
}

.add-first-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  color: white;
  border-radius: 12px;
  padding: 0.875rem 2rem;
  font-weight: 600;
}

.pagination-section {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.custom-paginator {
  background: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 1rem;
}

@media (max-width: 768px) {
  .trips-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .search-filter-section {
    flex-direction: column;
  }
  
  .trips-grid {
    grid-template-columns: 1fr;
  }
  
  .date-range {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .date-separator {
    transform: rotate(90deg);
  }
}
</style>