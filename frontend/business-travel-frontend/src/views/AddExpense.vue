<template>
  <div class="add-expense-page">
    <div class="page-hero">
      <div class="hero-content">
        <h1 class="page-title">
          <i class="pi pi-plus-circle"></i>
          Add New Expense
        </h1>
        <p class="page-subtitle">Record a new business expense for your trips</p>
      </div>
    </div>

    <div class="content-wrapper">
      <Card class="form-card modern-card">
        <template #content>
          <div class="card-header-modern">
            <div class="header-info">
              <i class="pi pi-wallet header-icon"></i>
              <span class="header-title">Expense Information</span>
            </div>
          </div>

          <div class="form-section">
            <form @submit.prevent="submitExpense" class="modern-form">
              <div class="form-grid">
                <div class="form-field">
                  <label for="description" class="field-label">
                    <i class="pi pi-file-edit label-icon"></i>
                    {{ $t('expenseDescription') }} *
                  </label>
                  <InputText
                    id="description"
                    v-model="expense.description"
                    :placeholder="'Enter expense description'"
                    required
                    class="modern-input"
                  />
                </div>

                <div class="form-field">
                  <label for="category" class="field-label">
                    <i class="pi pi-tags label-icon"></i>
                    {{ $t('category') }} *
                  </label>
                  <Dropdown
                    id="category"
                    v-model="expense.category"
                    :options="categories"
                    optionLabel="name"
                    optionValue="value"
                    :placeholder="'Select category'"
                    required
                    class="modern-dropdown"
                  >
                    <template #option="slotProps">
                      <div class="category-option">
                        <i :class="getCategoryIcon(slotProps.option.value)" class="category-icon"></i>
                        <span>{{ slotProps.option.name }}</span>
                      </div>
                    </template>
                  </Dropdown>
                </div>

                <div class="form-field">
                  <label for="amount" class="field-label">
                    <i class="pi pi-dollar label-icon"></i>
                    {{ $t('amount') }} *
                  </label>
                  <InputNumber
                    id="amount"
                    v-model="expense.amount"
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                    :min="0"
                    placeholder="0.00"
                    required
                    class="modern-input-number"
                  />
                </div>

                <div class="form-field">
                  <label for="tripId" class="field-label">
                    <i class="pi pi-map-marker label-icon"></i>
                    {{ $t('businessTrip') }} *
                  </label>
                  <Dropdown
                    id="tripId"
                    v-model="expense.trip_id"
                    :options="trips"
                    optionLabel="destination"
                    optionValue="id"
                    :placeholder="'Select business trip'"
                    :loading="tripsLoading"
                    required
                    class="modern-dropdown"
                    :disabled="tripsLoading"
                  >
                    <template #option="slotProps">
                      <div class="trip-option">
                        <div class="trip-info">
                          <i class="pi pi-map-marker trip-icon"></i>
                          <div class="trip-details">
                            <span class="trip-destination">{{ slotProps.option.destination }}</span>
                            <span class="trip-purpose">{{ slotProps.option.purpose }}</span>
                          </div>
                        </div>
                      </div>
                    </template>
                    <template #value="slotProps">
                      <div v-if="slotProps.value" class="selected-trip">
                        <i class="pi pi-map-marker"></i>
                        <span>{{ getSelectedTripName(slotProps.value) }}</span>
                      </div>
                    </template>
                  </Dropdown>
                </div>
              </div>

              <div class="form-actions">
                <Button
                  :label="'Cancel'"
                  icon="pi pi-times"
                  class="p-button-outlined p-button-secondary cancel-btn"
                  @click="$router.push('/expenses')"
                  type="button"
                />
                <Button
                  :label="'Add Expense'"
                  icon="pi pi-check"
                  type="submit"
                  :loading="loading"
                  class="gradient-button-secondary submit-btn"
                />
              </div>
            </form>
          </div>
        </template>
      </Card>
    </div>

    <Toast />
  </div>
</template>

<script>
import axios from 'axios';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

export default {
  components: {
    Card,
    InputText,
    InputNumber,
    Dropdown,
    Button,
    Toast
  },
  data() {
    return {
      expense: {
        description: '',
        amount: null,
        category: '',
        trip_id: null,
      },
      trips: [],
      categories: [
        { name: '✈️ Transportation', value: 'Transportation' },
        { name: '🏨 Accommodation', value: 'Accommodation' },
        { name: '🍽️ Meals', value: 'Meals' },
        { name: '🎪 Entertainment', value: 'Entertainment' },
        { name: '📋 Conference', value: 'Conference' },
        { name: '📎 Other', value: 'Other' }
      ],
      loading: false,
      tripsLoading: false,
      error: null,
    };
  },
  mounted() {
    this.fetchTrips();
  },
  methods: {
    async fetchTrips() {
      this.tripsLoading = true;
      try {
        const response = await axios.get('http://localhost:3000/api/trips');
        this.trips = response.data;
      } catch (error) {
        this.error = error.message;
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load trips',
          life: 3000
        });
      } finally {
        this.tripsLoading = false;
      }
    },
    async submitExpense() {
      this.loading = true;
      try {
        const response = await axios.post('http://localhost:3000/api/expenses', this.expense);
        console.log('Expense added:', response.data);

        this.$toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Expense added successfully!',
          life: 3000
        });

        // Reset form
        this.expense = {
          description: '',
          amount: null,
          category: '',
          trip_id: null,
        };

        // Redirect to expenses list after a short delay
        setTimeout(() => {
          this.$router.push('/expenses');
        }, 1500);
      } catch (error) {
        console.error('Error adding expense:', error);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add expense',
          life: 3000
        });
      } finally {
        this.loading = false;
      }
    },
    getCategoryIcon(category) {
      const icons = {
        'Transportation': 'pi pi-car',
        'Accommodation': 'pi pi-home',
        'Meals': 'pi pi-shopping-bag',
        'Entertainment': 'pi pi-star',
        'Conference': 'pi pi-users',
        'Other': 'pi pi-ellipsis-h'
      };
      return icons[category] || 'pi pi-tag';
    },
    getSelectedTripName(tripId) {
      const trip = this.trips.find(t => t.id === tripId);
      return trip ? trip.destination : 'Select trip';
    }
  },
};
</script>

<style scoped>
.add-expense-page {
  min-height: calc(100vh - 80px);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.page-hero {
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.9) 0%, rgba(245, 87, 108, 0.9) 100%);
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
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
}

.modern-card {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.card-header-modern {
  padding: 2rem 2rem 1.5rem 2rem;
  border-bottom: 2px solid rgba(240, 147, 251, 0.1);
  background: linear-gradient(135deg, #fef7ff 0%, #fdf2f8 100%);
  margin: -1.5rem -1.5rem 0 -1.5rem;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: center;
}

.header-icon {
  font-size: 1.8rem;
  color: #f093fb;
}

.header-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2d3748;
}

.form-section {
  padding: 2.5rem 2rem;
}

.modern-form {
  max-width: 100%;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 3rem;
}

.form-field {
  display: flex;
  flex-direction: column;
}

.field-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2d3748;
  font-size: 1.1rem;
}

.label-icon {
  color: #f093fb;
  font-size: 1.2rem;
}

.modern-input {
  width: 100%;
  padding: 1.2rem 1.5rem;
  font-size: 1.1rem;
  border: 2px solid rgba(240, 147, 251, 0.2);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(240, 147, 251, 0.05);
}

.modern-input:focus {
  border-color: #f093fb;
  background: white;
  box-shadow: 0 0 0 0.2rem rgba(240, 147, 251, 0.25), 0 8px 25px rgba(240, 147, 251, 0.15);
}

.modern-dropdown {
  width: 100%;
}

.modern-dropdown :deep(.p-dropdown) {
  width: 100%;
  border: 2px solid rgba(240, 147, 251, 0.2);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(240, 147, 251, 0.05);
}

.modern-dropdown :deep(.p-dropdown:not(.p-disabled):hover) {
  border-color: rgba(240, 147, 251, 0.4);
}

.modern-dropdown :deep(.p-dropdown:not(.p-disabled).p-focus) {
  border-color: #f093fb;
  background: white;
  box-shadow: 0 0 0 0.2rem rgba(240, 147, 251, 0.25), 0 8px 25px rgba(240, 147, 251, 0.15);
}

.modern-dropdown :deep(.p-dropdown-label) {
  padding: 1.2rem 1.5rem;
  font-size: 1.1rem;
}

.modern-input-number {
  width: 100%;
}

.modern-input-number :deep(.p-inputnumber-input) {
  width: 100%;
  padding: 1.2rem 1.5rem;
  font-size: 1.1rem;
  border: 2px solid rgba(240, 147, 251, 0.2);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(240, 147, 251, 0.05);
}

.modern-input-number :deep(.p-inputnumber-input:focus) {
  border-color: #f093fb;
  background: white;
  box-shadow: 0 0 0 0.2rem rgba(240, 147, 251, 0.25), 0 8px 25px rgba(240, 147, 251, 0.15);
}

.category-option, .trip-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
}

.category-icon, .trip-icon {
  color: #f093fb;
  font-size: 1.1rem;
}

.trip-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
}

.trip-details {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.trip-destination {
  font-weight: 600;
  color: #2d3748;
}

.trip-purpose {
  font-size: 0.9rem;
  color: #6b7280;
}

.selected-trip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.selected-trip i {
  color: #f093fb;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(240, 147, 251, 0.1);
}

.cancel-btn {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 16px;
  border: 2px solid #6b7280;
  color: #6b7280;
  transition: all 0.3s ease;
}

.cancel-btn:hover {
  background: #6b7280;
  color: white;
  transform: translateY(-2px);
}

.submit-btn {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  border-radius: 16px;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(240, 147, 251, 0.3);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }

  .content-wrapper {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .form-section {
    padding: 2rem 1.5rem;
  }

  .card-header-modern {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;
    gap: 1rem;
  }

  .form-actions button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-hero {
    padding: 2rem 1rem;
  }

  .page-title {
    font-size: 1.75rem;
  }

  .form-section {
    padding: 1.5rem 1rem;
  }
}
</style>
