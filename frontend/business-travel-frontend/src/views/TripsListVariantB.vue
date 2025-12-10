<template>
  <div class="trips-page-compact">
    <!-- Compact Toolbar with Breadcrumbs -->
    <div class="toolbar-wrapper">
      <div class="toolbar-content">
        <div class="toolbar-left">
          <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="custom-breadcrumb" />
          <h1 class="page-title-inline">
            <i class="pi pi-map-marker"></i>
            {{ $t('tripsHeader') }}
          </h1>
        </div>
        <div class="toolbar-right">
          <IconField>
            <InputIcon class="pi pi-search" />
            <InputText
              v-model="searchQuery"
              :placeholder="$t('Search') + ' trips...'"
              class="search-input-compact"
            />
          </IconField>
          <Button
            :label="$t('newTrip')"
            icon="pi pi-plus"
            @click="redirectToAddTravel"
            class="gradient-button-primary add-button-compact"
          />
        </div>
      </div>
    </div>

    <!-- Main Content with DataTable -->
    <div class="content-wrapper-compact">
      <Card class="data-card">
        <template #content>
          <DataTable
            :value="filteredTrips"
            v-model:selection="selectedTrip"
            selectionMode="single"
            :paginator="true"
            :rows="15"
            dataKey="id"
            :loading="loading"
            class="compact-table"
            :rowHover="true"
            stripedRows
            responsiveLayout="stack"
            breakpoint="768px"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[15, 25, 50]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} trips"
          >
            <template #empty>
              <div class="empty-state">
                <i class="pi pi-inbox empty-icon"></i>
                <p class="empty-text">No trips found</p>
                <Button
                  label="Add Your First Trip"
                  icon="pi pi-plus"
                  @click="redirectToAddTravel"
                  class="p-button-outlined"
                />
              </div>
            </template>

            <Column field="destination" :header="$t('destination')" :sortable="true" class="destination-column">
              <template #body="slotProps">
                <div class="destination-cell" v-if="slotProps.data">
                  <i class="pi pi-map-marker destination-icon"></i>
                  <span class="destination-text">{{ slotProps.data && slotProps.data.destination }}</span>
                </div>
              </template>
            </Column>
            
            <Column field="purpose" :header="$t('tripName')" :sortable="true" class="purpose-column">
              <template #body="slotProps">
                <span class="purpose-text" v-if="slotProps.data">{{ slotProps.data && slotProps.data.purpose }}</span>
              </template>
            </Column>
            
            <Column field="startDate" :header="$t('startDate')" :sortable="true" class="date-column">
              <template #body="slotProps">
                <Tag v-if="slotProps.data" severity="info" :value="formatDate(slotProps.data.startDate)" class="date-tag" />
              </template>
            </Column>
            
            <Column field="endDate" :header="$t('endDate')" :sortable="true" class="date-column">
              <template #body="slotProps">
                <Tag v-if="slotProps.data" severity="success" :value="formatDate(slotProps.data.endDate)" class="date-tag" />
              </template>
            </Column>
            
            <Column header="Actions" class="actions-column">
              <template #body="slotProps">
                <div class="action-buttons" v-if="slotProps.data">
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-sm p-button-text action-btn edit-btn"
                    @click="editTrip(slotProps.data)"
                    v-tooltip.top="'Edit'"
                    aria-label="Edit trip"
                  />
                  <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-sm p-button-text action-btn delete-btn"
                    @click="confirmDelete(slotProps.data)"
                    v-tooltip.top="'Delete'"
                    aria-label="Delete trip"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <EditTripModal
      v-model="editDialogVisible"
      :trip="editingTrip"
      @save="saveTrip"
    />

    <AddTripModal
      v-model="addDialogVisible"
      @save="createTrip"
    />

    <DeleteConfirmationModal
      v-model="deleteDialogVisible"
      :title="$t('deleteTrip')"
      :message="$t('Are you sure you want to delete this trip?')"
      @confirm="deleteTrip"
    />
  </div>
</template>

<script>
import axios from "axios";
import config from "../config.js";
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Tag from 'primevue/tag';
import Breadcrumb from 'primevue/breadcrumb';
import EditTripModal from '@/components/modals/EditTripModal.vue';
import AddTripModal from '@/components/modals/AddTripModal.vue';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal.vue';
import { HotjarEvents } from '@/plugins/hotjar';

export default {
  components: {
    Card,
    DataTable,
    Column,
    Button,
    InputText,
    IconField,
    InputIcon,
    Tag,
    Breadcrumb,
    EditTripModal,
    AddTripModal,
    DeleteConfirmationModal
  },
  data() {
    return {
      trips: [],
      selectedTrip: null,
      searchQuery: '',
      loading: false,
      editDialogVisible: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      editingTrip: {},
      tripToDelete: null,
      breadcrumbHome: { icon: 'pi pi-home', command: () => this.$router.push('/') },
      breadcrumbItems: [
        { label: 'Trips', disabled: true }
      ],
      pageLoadTime: null
    };
  },
  computed: {
    filteredTrips() {
      if (!this.searchQuery) {
        return this.trips;
      }
      const query = this.searchQuery.toLowerCase();
      return this.trips.filter((trip) => {
        if (!trip) return false;
        return (
          (trip.destination && trip.destination.toLowerCase().includes(query)) ||
          (trip.purpose && trip.purpose.toLowerCase().includes(query))
        );
      });
    },
  },
  watch: {
    searchQuery(newVal) {
      if (newVal) {
        HotjarEvents.trackSearch(newVal, 'TripsList', 'B');
        HotjarEvents.trackFeatureUsage('compact_search', 'TripsList', 'B');
      }
    }
  },
  mounted() {
    // Track page view for TripsList Variant B
    HotjarEvents.trackPageView('TripsList', 'B');
    HotjarEvents.trackABTestAssignment('trips_list_test', 'B');
    HotjarEvents.trackFeatureUsage('compact_toolbar', 'TripsList', 'B');
    HotjarEvents.trackFeatureUsage('breadcrumb_navigation', 'TripsList', 'B');
    
    this.pageLoadTime = Date.now();
    this.fetchTrips();
  },
  beforeUnmount() {
    if (this.pageLoadTime) {
      const timeOnPage = Math.round((Date.now() - this.pageLoadTime) / 1000);
      HotjarEvents.trackTimeOnPage('TripsList', 'B', timeOnPage);
    }
  },
  methods: {
    async fetchTrips() {
      this.loading = true;
      try {
        const response = await axios.get(`${config.apiBaseUrl}/trips`);
        this.trips = response.data;
      } catch (error) {
        console.error("Error fetching trips:", error);
      } finally {
        this.loading = false;
      }
    },
    redirectToAddTravel() {
      HotjarEvents.trackButtonClick('add_trip_compact_toolbar', 'TripsList', 'B');
      this.addDialogVisible = true;
    },
    editTrip(trip) {
      HotjarEvents.trackButtonClick('edit_trip_compact_button', 'TripsList', 'B');
      this.editingTrip = { ...trip };
      this.editDialogVisible = true;
    },
    async createTrip(tripData) {
      try {
        const response = await axios.post(`${config.apiBaseUrl}/trips`, tripData);
        this.trips.unshift(response.data);
        HotjarEvents.trackCRUDOperation('create', 'trip', 'TripsList', 'B');
      } catch (error) {
        console.error("Error creating trip:", error);
      }
    },
    async saveTrip(updatedTripData) {
      try {
        if (!updatedTripData || !updatedTripData.id) {
          console.error("Invalid trip data received");
          return;
        }

        const response = await axios.put(
          `${config.apiBaseUrl}/trips/${updatedTripData.id}`,
          updatedTripData
        );

        if (response && response.data) {
          const updatedIndex = this.trips.findIndex((trip) => trip && trip.id === updatedTripData.id);
          if (updatedIndex !== -1) {
            this.trips.splice(updatedIndex, 1, response.data);
          }
        } else {
          console.error("Invalid response data when saving trip");
        }

        HotjarEvents.trackCRUDOperation('update', 'trip', 'TripsList', 'B');

        await this.fetchTrips();
        this.editDialogVisible = false;
      } catch (error) {
        console.error("Error editing trip:", error);
        this.editDialogVisible = false;
        this.fetchTrips();
      }
    },
    confirmDelete(trip) {
      HotjarEvents.trackButtonClick('delete_trip_compact_button', 'TripsList', 'B');
      this.tripToDelete = trip;
      this.deleteDialogVisible = true;
    },
    async deleteTrip() {
      try {
        await axios.delete(`${config.apiBaseUrl}/trips/${this.tripToDelete.id}`);
        this.trips = this.trips.filter((trip) => trip.id !== this.tripToDelete.id);
        HotjarEvents.trackCRUDOperation('delete', 'trip', 'TripsList', 'B');
        this.deleteDialogVisible = false;
        this.tripToDelete = null;
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    },
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString();
    }
  },
};
</script>

<style scoped>
.trips-page-compact {
  min-height: calc(100vh - 80px);
  background: #f8f9fa;
}

/* Compact Toolbar */
.toolbar-wrapper {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 80px;
  z-index: 100;
}

.toolbar-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex: 1;
}

.custom-breadcrumb {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.page-title-inline {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  white-space: nowrap;
}

.page-title-inline i {
  color: #667eea;
  font-size: 1.5rem;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-input-compact {
  width: 320px;
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #f8f9fa;
  transition: all 0.3s ease;
}

.search-input-compact:focus {
  background: white;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.add-button-compact {
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  white-space: nowrap;
}

/* Content Wrapper */
.content-wrapper-compact {
  max-width: 1600px;
  margin: 0 auto;
  padding: 2rem;
}

.data-card {
  background: white;
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  border-radius: 12px;
}

/* Compact DataTable */
.compact-table {
  border-radius: 12px;
}

.compact-table :deep(.p-datatable-wrapper) {
  border-radius: 12px;
}

.compact-table :deep(.p-datatable-thead > tr > th) {
  background: #f8f9fa;
  color: #4b5563;
  font-weight: 700;
  padding: 1rem 1rem;
  border-bottom: 2px solid #e2e8f0;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.compact-table :deep(.p-datatable-tbody > tr > td) {
  padding: 1rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  color: #2d3748;
  font-size: 0.95rem;
}

.compact-table :deep(.p-datatable-tbody > tr:hover > td) {
  background: #f9fafb !important;
}

.compact-table :deep(.p-paginator) {
  background: #f8f9fa;
  border: none;
  border-top: 1px solid #e2e8f0;
  padding: 1rem;
  border-radius: 0 0 12px 12px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
}

.empty-text {
  font-size: 1.25rem;
  color: #64748b;
  margin-bottom: 2rem;
}

/* Cell Styles */
.destination-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.destination-icon {
  color: #667eea;
  font-size: 1.1rem;
}

.destination-text {
  font-weight: 600;
  color: #2d3748;
}

.purpose-text {
  color: #4b5563;
}

.date-tag {
  font-weight: 500;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.875rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.action-btn {
  width: 2rem;
  height: 2rem;
  transition: all 0.2s ease;
}

.edit-btn {
  color: #f59e0b !important;
}

.edit-btn:hover {
  background: #fef3c7 !important;
  color: #d97706 !important;
}

.delete-btn {
  color: #ef4444 !important;
}

.delete-btn:hover {
  background: #fee2e2 !important;
  color: #dc2626 !important;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .toolbar-content {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .toolbar-left,
  .toolbar-right {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input-compact {
    width: 100%;
  }

  .page-title-inline {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .toolbar-content {
    padding: 1rem;
  }

  .content-wrapper-compact {
    padding: 1rem;
  }

  .page-title-inline {
    font-size: 1.25rem;
  }

  .compact-table :deep(.p-datatable-thead > tr > th) {
    padding: 0.75rem 0.5rem;
    font-size: 0.8rem;
  }

  .compact-table :deep(.p-datatable-tbody > tr > td) {
    padding: 0.75rem 0.5rem;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }

  .add-button-compact {
    width: 100%;
    justify-content: center;
  }
}
</style>
