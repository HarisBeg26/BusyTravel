<template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ $t('editExpense') }}</h2>
        <button class="close-button" @click="$emit('update:modelValue', false)">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="modal-content">
        <div class="form-grid">
          <div class="form-field">
            <label for="description">
              <i class="pi pi-file-edit"></i>
              {{ $t('expenseDescription') }}
            </label>
            <input
              id="description"
              v-model="localExpense.description"
              type="text"
              class="form-input"
            />
          </div>

          <div class="form-field">
            <label for="category">
              <i class="pi pi-tag"></i>
              {{ $t('category') }}
            </label>
            <input
              id="category"
              v-model="localExpense.category"
              type="text"
              class="form-input"
            />
          </div>

          <div class="form-field">
            <label for="amount">
              <i class="pi pi-dollar"></i>
              {{ $t('amount') }}
            </label>
            <input
              id="amount"
              v-model.number="localExpense.amount"
              type="number"
              step="0.01"
              class="form-input"
            />
          </div>

          <div class="form-field">
            <label for="tripId">
              <i class="pi pi-map"></i>
              {{ $t('tripId') }}
            </label>
            <input
              id="tripId"
              v-model.number="localExpense.trip_id"
              type="number"
              class="form-input"
            />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="btn btn-secondary"
          @click="$emit('update:modelValue', false)"
        >
          {{ $t('Cancel') }}
        </button>
        <button
          class="btn btn-primary"
          @click="handleSave"
        >
          {{ $t('Save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditExpenseModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    expense: {
      type: Object,
      required: true
    }
  },
  emits: ['update:modelValue', 'save'],
  data() {
    return {
      localExpense: { ...this.expense }
    }
  },
  watch: {
    expense: {
      handler(newExpense) {
        this.localExpense = { ...newExpense };
      },
      deep: true
    }
  },
  methods: {
    handleSave() {
      this.$emit('save', this.localExpense);
      this.$emit('update:modelValue', false);
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 24px 40px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
  margin: 2rem;
}

.modal-header {
  background: #f8fafc;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  border-radius: 12px 12px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: all 0.2s;
}

.close-button:hover {
  background: #f1f5f9;
  color: #1e293b;
}

.modal-content {
  padding: 2rem;
  background: white;
}

.modal-footer {
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
  border-radius: 0 0 12px 12px;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-field label {
  font-weight: 600;
  color: #374151;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-field label i {
  color: #6b7280;
}

.form-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
  transition: all 0.2s ease;
  font-size: 0.95rem;
  color: #1e293b;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  background: white;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background: #f3f4f6;
  color: #4b5563;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-container {
    margin: 1rem;
  }
}
</style>
