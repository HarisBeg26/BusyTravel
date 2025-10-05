<template>
  <div class="expenses-page">
    <div class="page-hero">
      <div class="hero-content">
        <h1 class="page-title">
          <i class="pi pi-wallet"></i>
          {{ $t('expenses') }}
        </h1>
        <p class="page-subtitle">Manage and track your business expenses</p>
      </div>
    </div>

    <div class="content-wrapper">
      <Card class="modern-card">
        <template #header>
          <div class="card-header-modern">
            <div class="header-info">
              <i class="pi pi-wallet header-icon"></i>
              <h2 class="header-title">{{ $t('expenses') }}</h2>
            </div>
            <Button
              :label="$t('addExpense')"
              icon="pi pi-plus"
              class="gradient-button-primary add-button"
              @click="redirectToAddExpense"
            />
          </div>
        </template>
        <template #content>
          <div class="table-section">
            <div class="search-section">
              <IconField iconPosition="left" class="search-field">
                <InputIcon class="pi pi-search" />
                <InputText
                  v-model="searchQuery"
                  placeholder="Search expenses..."
                  class="search-input-modern"
                />
              </IconField>
            </div>

            <DataTable
              :value="filteredExpenses"
              v-model:selection="selectedExpense"
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
              <Column
                field="description"
                :header="$t('expenseDescription')"
                :sortable="true"
                class="description-column"
              >
                <template #body="slotProps">
                  <div class="description-cell">
                    <i class="pi pi-file-edit description-icon"></i>
                    <span class="description-text"
                      >{{ slotProps.data.description }}</span
                    >
                  </div>
                </template>
              </Column>
              <Column
                field="category"
                :header="$t('category')"
                :sortable="true"
                class="category-column"
              >
                <template #body="slotProps">
                  <Tag
                    :value="slotProps.data.category"
                    severity="info"
                    class="category-tag"
                  ></Tag>
                </template>
              </Column>
              <Column
                field="amount"
                :header="$t('amount')"
                :sortable="true"
                class="amount-column"
              >
                <template #body="slotProps">
                  <span class="amount-badge"
                    >{{ formatCurrency(slotProps.data.amount) }}</span
                  >
                </template>
              </Column>
              <Column
                field="trip_id"
                :header="$t('tripId')"
                :sortable="true"
                class="trip-column"
              >
                <template #body="slotProps">
                  <Tag
                    severity="secondary"
                    :value="'Trip #' + slotProps.data.trip_id"
                    class="trip-tag"
                  ></Tag>
                </template>
              </Column>
              <Column header="Actions" class="actions-column">
                <template #body="slotProps">
                  <div class="action-buttons">
                    <Button
                      icon="pi pi-pencil"
                      class="p-button-rounded p-button-sm p-button-warning action-btn edit-btn"
                      @click="editExpense(slotProps.data)"
                      v-tooltip.top="'Edit Expense'"
                    />
                    <Button
                      icon="pi pi-trash"
                      class="p-button-rounded p-button-sm p-button-danger action-btn delete-btn"
                      @click="confirmDelete(slotProps.data)"
                      v-tooltip.top="'Delete Expense'"
                    />
                  </div>
                </template>
              </Column>
            </DataTable>
          </div>
        </template>
      </Card>
    </div>

    <!-- Edit Expense Modal -->
    <EditExpenseModal
      v-model="editDialogVisible"
      :expense="editingExpense"
      @save="saveExpense"
    />

    <AddExpenseModal
      v-model="addDialogVisible"
      @save="createExpense"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmationModal
      v-model="deleteDialogVisible"
      :title="$t('deleteExpense')"
      :message="$t('Are you sure you want to delete this expense?')"
      @confirm="deleteExpense"
    />
  </div>
</template>

<script>
import axios from 'axios';
import config from '../config.js';
import Card from 'primevue/card';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import Tag from 'primevue/tag';
import Toast from 'primevue/toast';
import EditExpenseModal from '@/components/modals/EditExpenseModal.vue';
import AddExpenseModal from '@/components/modals/AddExpenseModal.vue';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal.vue';

export default {
  components: {
    Card,
    DataTable,
    Column,
    Button,
    InputText,
    InputNumber,
    IconField,
    InputIcon,
    Tag,
    Toast,
    EditExpenseModal,
    AddExpenseModal,
    DeleteConfirmationModal,
  },
  data() {
    return {
      expenses: [],
      selectedExpense: null,
      searchQuery: '',
      loading: false,
      editDialogVisible: false,
      addDialogVisible: false,
      deleteDialogVisible: false,
      editingExpense: {},
      expenseToDelete: null,
    };
  },
  mounted() {
    this.fetchExpenses();
  },
  computed: {
    filteredExpenses() {
      return this.expenses.filter((expense) => {
        const description = expense.description.toLowerCase();
        const category = expense.category.toLowerCase();
        const query = this.searchQuery.toLowerCase();
        return description.includes(query) || category.includes(query);
      });
    },
  },
  methods: {
    async fetchExpenses() {
      this.loading = true;
      try {
        const response = await axios.get(`${config.apiBaseUrl}/expenses`);
        this.expenses = response.data;
      } catch (error) {
        console.error('Error fetching expenses:', error);
      } finally {
        this.loading = false;
      }
    },
    redirectToAddExpense() {
      this.addDialogVisible = true;
    },
    async createExpense(expenseData) {
      try {
        const response = await axios.post(`${config.apiBaseUrl}/expenses`, expenseData);
        this.expenses.unshift(response.data);
      } catch (error) {
        console.error('Error creating expense:', error);
      }
    },
    editExpense(expense) {
      this.editingExpense = { ...expense };
      this.editDialogVisible = true;
    },
    async saveExpense() {
      try {
        const updatedExpense = { ...this.editingExpense };
        const response = await axios.put(
          `${config.apiBaseUrl}/expenses/${this.editingExpense.id}`,
          updatedExpense
        );
        const updatedExpenseIndex = this.expenses.findIndex(
          (exp) => exp.id === this.editingExpense.id
        );
        if (updatedExpenseIndex !== -1) {
          this.expenses.splice(updatedExpenseIndex, 1, response.data);
        }
        this.editDialogVisible = false;
      } catch (error) {
        console.error('Error editing expense:', error);
      }
    },
    confirmDelete(expense) {
      this.expenseToDelete = expense;
      this.deleteDialogVisible = true;
    },
    async deleteExpense() {
      try {
        await axios.delete(
          `${config.apiBaseUrl}/expenses/${this.expenseToDelete.id}`
        );
        this.expenses = this.expenses.filter(
          (expense) => expense.id !== this.expenseToDelete.id
        );
        this.deleteDialogVisible = false;
        this.expenseToDelete = null;
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    },
    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    },
  },
};
</script>

<style scoped>
.expenses-page {
  min-height: calc(100vh - 80px);
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 100%
  );
}

.page-hero {
  background: linear-gradient(
    135deg,
    rgba(167, 139, 250, 0.9) 0%,
    rgba(139, 92, 246, 0.9) 100%
  );
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
  background: radial-gradient(
    circle at 30% 50%,
    rgba(255, 255, 255, 0.1) 0%,
    transparent 50%
  );
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
  background: linear-gradient(145deg, #1e1b2d 0%, #2d2a3d 100%) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(167, 139, 250, 0.1);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  color: #fff;
}

.card-header-modern {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem 1.5rem 2rem;
  border-bottom: 2px solid rgba(167, 139, 250, 0.1);
  background: linear-gradient(135deg, #2d2a3d 0%, #1e1b2d 100%);
  margin: -1.5rem -1.5rem 0 -1.5rem;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 1.8rem;
  color: #a78bfa;
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
  background: rgba(30, 27, 45, 0.9);
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
  color: rgba(255, 255, 255, 0.6);
}

/* Enhanced DataTable Styling */
.modern-table {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(167, 139, 250, 0.1);
}

.modern-table :deep(.p-datatable-wrapper) {
  border-radius: 20px;
  background: #2d2a3d;
}

.modern-table :deep(.p-datatable-thead > tr > th) {
  background: linear-gradient(135deg, #3c3851 0%, #2d2a3d 100%);
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
  border-bottom: 1px solid rgba(167, 139, 250, 0.05);
  background: #2d2a3d;
  color: #fff;
}

.modern-table :deep(.p-datatable-tbody > tr:nth-child(even) > td) {
  background: #1e1b2d;
}

.modern-table :deep(.p-datatable-tbody > tr:hover > td) {
  background: #3c3851 !important;
  transform: scale(1.001);
  transition: all 0.3s ease;
}

.modern-table :deep(.p-paginator) {
  background: #1e1b2d;
  border: none;
  border-top: 1px solid rgba(167, 139, 250, 0.1);
  padding: 1rem;
  color: #fff;
}

.modern-table :deep(.p-paginator .p-paginator-pages .p-paginator-page) {
  color: #fff;
}

.description-cell {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.description-icon {
  color: #a78bfa;
  font-size: 1.2rem;
}

.description-text {
  color: #fff;
}

.category-tag,
.trip-tag {
  font-weight: 600;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.amount-badge {
  background: linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%);
  color: white;
  padding: 0.5rem 1.2rem;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1.1rem;
  box-shadow: 0 2px 10px rgba(167, 139, 250, 0.3);
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
      box-shadow: 0 0 0 0.2rem rgba(59, 130, 246, 0.1);
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
    color: #f59e0b;
  }

  .confirmation-text {
    h4 {
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #374151;
    }

    p {
      margin: 0;
      color: #6b7280;
      line-height: 1.5;
    }
  }
}

@media (max-width: 600px) {
  .dialog-form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .dialog-content-modern {
    padding: 1rem;
  }
  .dialog-actions {
    flex-direction: column;
    gap: 0.5rem;
  }

  .content-wrapper {
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
  color: #f59e0b;
}

.confirmation-content .confirmation-text h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.confirmation-content .confirmation-text p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
}
