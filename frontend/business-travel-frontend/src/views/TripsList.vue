<template>
  <div class="trips-page">
    <div class="page-hero">
      <div class="hero-content">
        <h1 class="page-title">
          <i class="pi pi-map-marker"></i>
          {{ $t('tripsHeader') }}
        </h1>
        <p class="page-subtitle">Manage and track your business trips</p>
      </div>
    </div>

    <div class="content-wrapper">
      <Card class="modern-card">
        <template #content>
          <div class="card-header-modern">
            <div class="header-info">
              <i class="pi pi-list header-icon"></i>
              <span class="header-title">{{ $t('tripDetails') }}</span>
            </div>
            <Button
              :label="$t('newTrip')"
              icon="pi pi-plus"
              @click="redirectToAddTravel"
              class="gradient-button-primary add-button"
            />
          </div>

          <div class="table-section">
            <div class="search-section">
              <IconField>
                <InputIcon class="pi pi-search" />
                <InputText
                  v-model="searchQuery"
                  :placeholder="$t('Search') + ' trips...'"
                  class="search-input-modern"
                />
              </IconField>
            </div>

            <DataTable
              :value="filteredTrips"
              v-model:selection="selectedTrip"
              selectionMode="single"
              :paginator="true"
              :rows="10"
              dataKey="id"
              :loading="loading"
              class="modern-table"
              :rowHover="true"
              stripedRows
              responsiveLayout="stack"
              breakpoint="768px"
            >
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
              <Column :header="$t('editTrip')" class="actions-column">
                <template #body="slotProps">
                  <div class="action-buttons" v-if="slotProps.data">
                    <Button
                      icon="pi pi-pencil"
                      class="p-button-rounded p-button-sm p-button-warning action-btn edit-btn"
                      @click="editTrip(slotProps.data)"
                      v-tooltip.top="'Edit Trip'"
                    />
                    <Button
                      icon="pi pi-trash"
                      class="p-button-rounded p-button-sm p-button-danger action-btn delete-btn"
                      @click="confirmDelete(slotProps.data)"
                      v-tooltip.top="'Delete Trip'"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
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
import { ref } from "vue";
import config from "../config.js";
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Tag from 'primevue/tag';
import EditTripModal from '@/components/modals/EditTripModal.vue';
import AddTripModal from '@/components/modals/AddTripModal.vue';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal.vue';

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
      tripToDelete: null
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
  mounted() {
    this.fetchTrips();
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
      this.addDialogVisible = true;
    },
    editTrip(trip) {
      this.editingTrip = { ...trip };
      this.editDialogVisible = true;
    },
    async createTrip(tripData) {
      try {
        const response = await axios.post(`${config.apiBaseUrl}/trips`, tripData);
        this.trips.unshift(response.data);
      } catch (error) {
        console.error("Error creating trip:", error);
      }
    },
    async saveTrip() {
      try {
        const response = await axios.put(
          `${config.apiBaseUrl}/trips/${this.editingTrip.id}`,
          this.editingTrip
        );

        // Check if response and data are valid before updating
        if (response && response.data) {
          const updatedIndex = this.trips.findIndex((trip) => trip && trip.id === this.editingTrip.id);
          if (updatedIndex !== -1) {
            this.trips.splice(updatedIndex, 1, response.data);
          }
        } else {
          console.error("Invalid response data when saving trip");
        }

        // Refresh data to ensure consistency
        await this.fetchTrips();
        this.editDialogVisible = false;
      } catch (error) {
        console.error("Error editing trip:", error);
        // Still close the modal even if there's an error
        this.editDialogVisible = false;
        // Refresh trips to ensure data is consistent
        this.fetchTrips();
      }
    },
    confirmDelete(trip) {
      this.tripToDelete = trip;
      this.deleteDialogVisible = true;
    },
    async deleteTrip() {
      try {
        await axios.delete(`${config.apiBaseUrl}/trips/${this.tripToDelete.id}`);
        this.trips = this.trips.filter((trip) => trip.id !== this.tripToDelete.id);
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
.trips-page {
  min-height: calc(100vh - 80px);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.page-hero {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  padding: 3rem 2rem;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.page-hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.page-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.page-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  font-weight: 300;
}

.content-wrapper {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.modern-card {
  background: linear-gradient(145deg, #1a1c23 0%, #2d3748 100%) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  color: #fff;
}

.card-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1.5rem 2rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(135deg, #2d3748 0%, #1a1c23 100%);
  margin: -1.5rem -1.5rem 0 -1.5rem;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 1.8rem;
  color: #667eea;
}

.header-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
}

.add-button {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 12px;
}

.table-section {
  padding: 2rem;
}

.search-section {
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
}

.search-field {
  width: 100%;
  max-width: 500px;
  position: relative;
}

.search-input-modern {
  width: 100%;
  padding: 1.2rem 1.5rem 1.2rem 3rem;
  font-size: 1.1rem;
  background: rgba(26, 28, 35, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  color: #fff;
}

:deep(.p-inputtext) {
  padding-left: 3rem !important;
}

:deep(.p-input-icon) {
  left: 1rem;
  top: 50%;
  color: rgba(255, 255, 255, 0.6);
}

/* Enhanced DataTable Styling */
.modern-table {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modern-table :deep(.p-datatable-wrapper) {
  border-radius: 20px;
  background: #2d3748;
}

.modern-table :deep(.p-datatable-thead > tr > th) {
  background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
  color: white;
  font-weight: 700;
  padding: 1.5rem 1.2rem;
  border: none;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.modern-table :deep(.p-datatable-tbody > tr > td) {
  padding: 1.5rem 1.2rem;
  border: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: #2d3748;
  color: #fff;
}

.modern-table :deep(.p-datatable-tbody > tr:nth-child(even) > td) {
  background: #1a1c23;
}

.modern-table :deep(.p-datatable-tbody > tr:hover > td) {
  background: #4a5568 !important;
  transform: scale(1.001);
  transition: all 0.3s ease;
}

.modern-table :deep(.p-paginator) {
  background: #1a1c23;
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1rem;
  color: #fff;
}

.modern-table :deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  color: #fff;
}

.destination-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.destination-icon {
  color: #667eea;
  font-size: 1.2rem;
}

.destination-text {
  color: #fff !important;
}

.purpose-text {
  color: #e2e8f0 !important;
  font-weight: 500;
  font-size: 1rem;
}

.date-tag {
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.action-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: #f59e0b !important;
  transform: scale(1.1);
}

.delete-btn:hover {
  background: #ef4444 !important;
  transform: scale(1.1);
}

/* Dialog Improvements */
.dialog-content .field {
  margin-bottom: 2rem;
}

.dialog-content label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 700;
  color: #2d3748;
  font-size: 1rem;
}

/* Modern Dialog Styling */
.modern-dialog {
  :deep(.p-dialog-mask) {
    backdrop-filter: blur(4px);
    background: rgba(0, 0, 0, 0.6);
  }

  :deep(.p-dialog) {
    border-radius: 12px;
    box-shadow: 0 24px 40px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    background: #ffffff !important;
    border: none;
    max-width: 90vw;
    margin: 2rem;
  }

  :deep(.p-dialog-header) {
    background: #f8fafc !important;
    padding: 1.5rem 2rem;
    border-bottom: 1px solid #e2e8f0;
    border-radius: 12px 12px 0 0;

    .p-dialog-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
    }
  }

  :deep(.p-dialog-content) {
    padding: 2rem;
    background: #ffffff !important;
  }

  :deep(.p-dialog-footer) {
    padding: 1.5rem 2rem;
    background: #f8fafc !important;
    border-top: 1px solid #e2e8f0;
    border-radius: 0 0 12px 12px;
  }
}

.dialog-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  padding: 1rem 0;
}

.dialog-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .dialog-label {
    font-weight: 600;
    color: #374151;
    font-size: 0.95rem;
  }

  .dialog-input {
    width: 100%;
    padding: 0.75rem 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    background: #f8fafc;
    transition: all 0.2s ease;

    &:focus {
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
  }
}

.cancel-dialog-btn {
  background: #f3f4f6 !important;
  border: none !important;
  color: #4b5563 !important;
  font-weight: 600 !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 8px !important;

  &:hover {
    background: #e5e7eb !important;
  }
}

.save-dialog-btn {
  background: #3b82f6 !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 8px !important;

  &:hover {
    background: #2563eb !important;
  }
}

.delete-dialog-btn {
  background: #ef4444 !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 8px !important;

  &:hover {
    background: #dc2626 !important;
  }
}

.confirmation-content {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1rem 0;

  .warning-icon {
    font-size: 2rem;
    padding: 1rem;
  }

  .card-header-modern {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1.5rem;
  }

  .table-section {
    padding: 1rem;
  }

  .modern-table :deep(.p-datatable-thead > tr > th) {
    padding: 1rem 0.75rem;
    font-size: 0.9rem;
  }

  .modern-table :deep(.p-datatable-tbody > tr > td) {
    padding: 1rem 0.75rem;
  }
}
</style>


/* --- Dialog polish overrides: flatten nested selectors for scoped CSS --- */
:deep(.p-dialog-mask) {
  backdrop-filter: blur(4px);
  background: rgba(0, 0, 0, 0.6);
}

/* Apply to the dialog root when class="modern-dialog" is set on Dialog */
:deep(.modern-dialog.p-dialog) {
  border-radius: 12px;
  box-shadow: 0 24px 40px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  background: #ffffff !important;
  border: none;
  max-width: 90vw;
  margin: 2rem;
}

:deep(.modern-dialog .p-dialog-header) {
  background: #f8fafc !important;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 12px 12px 0 0;
}

:deep(.modern-dialog .p-dialog-header .p-dialog-title) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
}

:deep(.modern-dialog .p-dialog-content) {
  padding: 2rem;
  background: #ffffff !important;
}

:deep(.modern-dialog .p-dialog-footer) {
  padding: 1.5rem 2rem;
  background: #f8fafc !important;
  border-top: 1px solid #e2e8f0;
  border-radius: 0 0 12px 12px;
}

/* Form fields (no nesting) */
.dialog-field .dialog-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
}

.dialog-field .dialog-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  transition: all 0.2s ease;
}

.dialog-field .dialog-input:focus {
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Buttons */
.cancel-dialog-btn {
  background: #f3f4f6 !important;
  border: none !important;
  color: #4b5563 !important;
  font-weight: 600 !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 8px !important;
}

.cancel-dialog-btn:hover {
  background: #e5e7eb !important;
}

.save-dialog-btn {
  background: #3b82f6 !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 8px !important;
}

.save-dialog-btn:hover {
  background: #2563eb !important;
}

.delete-dialog-btn {
  background: #ef4444 !important;
  border: none !important;
  color: white !important;
  font-weight: 600 !important;
  padding: 0.75rem 1.5rem !important;
  border-radius: 8px !important;
}

.delete-dialog-btn:hover {
  background: #dc2626 !important;
}

/* Confirmation content tweaks */
.confirmation-content {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
  padding: 1rem 0;
}

.confirmation-content .warning-icon {
  font-size: 2rem;
  padding: 1rem;
}
