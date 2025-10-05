<template>
  <div class="add-trip-page">
    <div class="page-hero">
      <div class="hero-content">
        <h1 class="page-title">
          <i class="pi pi-plus-circle"></i>
          Add New Trip
        </h1>
        <p class="page-subtitle">Create a new business travel entry</p>
      </div>
    </div>

    <div class="content-wrapper">
      <Card class="form-card modern-card">
        <template #content>
          <div class="card-header-modern">
            <div class="header-info">
              <i class="pi pi-map-marker header-icon"></i>
              <span class="header-title">Trip Information</span>
            </div>
          </div>

          <div class="form-section">
            <form @submit.prevent="submitTrip" class="modern-form">
              <div class="form-grid">
                <div class="form-field">
                  <label for="destination" class="field-label">
                    <i class="pi pi-map-marker label-icon"></i>
                    {{ $t('destination') }} *
                  </label>
                  <InputText
                    id="destination"
                    v-model="destination"
                    :placeholder="'Enter destination city'"
                    required
                    class="modern-input"
                  />
                </div>

                <div class="form-field">
                  <label for="purpose" class="field-label">
                    <i class="pi pi-briefcase label-icon"></i>
                    {{ $t('tripName') }} *
                  </label>
                  <InputText
                    id="purpose"
                    v-model="purpose"
                    :placeholder="'Enter trip purpose'"
                    required
                    class="modern-input"
                  />
                </div>

                <div class="form-field">
                  <label for="start-date" class="field-label">
                    <i class="pi pi-calendar label-icon"></i>
                    {{ $t('startDate') }} *
                  </label>
                  <Calendar
                    id="start-date"
                    v-model="startDate"
                    dateFormat="yy-mm-dd"
                    :showIcon="true"
                    :showButtonBar="true"
                    placeholder="Select start date"
                    required
                    class="modern-calendar"
                  />
                </div>

                <div class="form-field">
                  <label for="end-date" class="field-label">
                    <i class="pi pi-calendar-plus label-icon"></i>
                    {{ $t('endDate') }} *
                  </label>
                  <Calendar
                    id="end-date"
                    v-model="endDate"
                    dateFormat="yy-mm-dd"
                    :showIcon="true"
                    :showButtonBar="true"
                    :minDate="startDate"
                    placeholder="Select end date"
                    required
                    class="modern-calendar"
                  />
                </div>
              </div>

              <div class="form-actions">
                <Button
                  :label="'Cancel'"
                  icon="pi pi-times"
                  class="p-button-outlined p-button-secondary cancel-btn"
                  @click="$router.push('/trips')"
                  type="button"
                />
                <Button
                  :label="'Add Trip'"
                  icon="pi pi-check"
                  type="submit"
                  :loading="loading"
                  class="gradient-button-primary submit-btn"
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
import Calendar from 'primevue/calendar';
import Button from 'primevue/button';
import Toast from 'primevue/toast';

export default {
  components: {
    Card,
    InputText,
    Calendar,
    Button,
    Toast
  },
  data() {
    return {
      destination: "",
      startDate: null,
      endDate: null,
      purpose: "",
      loading: false
    };
  },
  methods: {
    async submitTrip() {
      this.loading = true;
      const newTrip = {
        destination: this.destination,
        startDate: this.formatDate(this.startDate),
        endDate: this.formatDate(this.endDate),
        purpose: this.purpose,
      };
      try {
        const response = await axios.post("http://localhost:3000/api/trips", newTrip);
        console.log("Backend Response:", response.data);

        this.$toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Trip added successfully!',
          life: 3000
        });

        // Reset form after successful submission
        this.destination = "";
        this.startDate = null;
        this.endDate = null;
        this.purpose = "";

        // Redirect to trips list after a short delay
        setTimeout(() => {
          this.$router.push('/trips');
        }, 1500);
      } catch (error) {
        console.error("Error adding trip:", error.response?.data || error.message);
        this.$toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to add trip',
          life: 3000
        });
      } finally {
        this.loading = false;
      }
    },
    formatDate(date) {
      if (!date) return null;
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  }
}
</script>

<style scoped>
.add-trip-page {
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
  border-bottom: 2px solid rgba(102, 126, 234, 0.1);
  background: linear-gradient(135deg, #f8f9ff 0%, #e8eeff 100%);
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
  color: #667eea;
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
  color: #667eea;
  font-size: 1.2rem;
}

.modern-input {
  width: 100%;
  padding: 1.2rem 1.5rem;
  font-size: 1.1rem;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.05);
}

.modern-input:focus {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25), 0 8px 25px rgba(102, 126, 234, 0.15);
}

.modern-calendar {
  width: 100%;
}

.modern-calendar :deep(.p-inputtext) {
  width: 100%;
  padding: 1.2rem 1.5rem;
  font-size: 1.1rem;
  border: 2px solid rgba(102, 126, 234, 0.2);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.8);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.05);
}

.modern-calendar :deep(.p-inputtext:focus) {
  border-color: #667eea;
  background: white;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25), 0 8px 25px rgba(102, 126, 234, 0.15);
}

.modern-calendar :deep(.p-datepicker-trigger) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 12px;
  width: 3rem;
  height: 3rem;
  margin-left: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
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
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
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
