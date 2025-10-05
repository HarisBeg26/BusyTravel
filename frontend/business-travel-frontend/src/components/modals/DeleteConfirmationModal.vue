<template>
  <div v-if="modelValue" class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close-button" @click="$emit('update:modelValue', false)">
          <i class="pi pi-times"></i>
        </button>
      </div>

      <div class="modal-content">
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle warning-icon"></i>
          <div class="confirmation-text">
            <h4>{{ title }}</h4>
            <p>{{ message }}</p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button
          class="btn btn-secondary"
          @click="$emit('update:modelValue', false)"
        >
          {{ cancelLabel || $t('Cancel') || 'No' }}
        </button>
        <button
          class="btn btn-danger"
          @click="handleConfirm"
        >
          {{ confirmLabel || $t('Delete') || 'Yes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeleteConfirmationModal',
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true,
      title: 'Are you sure you want to delete this item?'
    },
    cancelLabel: {
      type: String,
      default: null
    },
    confirmLabel: {
      type: String,
      default: null
    }
  },
  emits: ['update:modelValue', 'confirm'],
  methods: {
    handleConfirm() {
      this.$emit('confirm');
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
  max-width: 400px;
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

.confirmation-content {
  display: flex;
  align-items: flex-start;
  gap: 1.5rem;
}

.warning-icon {
  font-size: 2rem;
  color: #f59e0b;
  padding: 0.5rem;
  background: #fef3c7;
  border-radius: 50%;
}

.confirmation-text h4 {
  margin: 0 0 0.5rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
}

.confirmation-text p {
  margin: 0;
  color: #6b7280;
  line-height: 1.5;
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

.btn-danger {
  background: #ef4444;
  color: white;
}

.btn-danger:hover {
  background: #dc2626;
}

@media (max-width: 640px) {
  .modal-container {
    margin: 1rem;
  }

  .confirmation-content {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
