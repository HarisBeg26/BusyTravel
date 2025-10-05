<template>
  <Dialog
    :visible="modelValue"
    @update:visible="$emit('update:modelValue', $event)"
    :header="title"
    :modal="true"
    :style="{ width: width || '500px' }"
    class="modern-dialog"
  >
    <div class="dialog-content-modern">
      <slot></slot>
    </div>
    <template #footer>
      <div class="dialog-actions">
        <Button
          :label="cancelLabel || $t('cancel') || 'Cancel'"
          icon="pi pi-times"
          @click="$emit('update:modelValue', false)"
          class="p-button-outlined cancel-dialog-btn"
        />
        <Button
          v-if="!hideConfirm"
          :label="confirmLabel || $t('save') || 'Save'"
          :icon="confirmIcon || 'pi pi-check'"
          @click="$emit('confirm')"
          :class="[confirmButtonClass || 'gradient-button-primary save-dialog-btn']"
          autofocus
        />
      </div>
    </template>
  </Dialog>
</template>

<script>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default {
  name: 'CustomModal',
  components: {
    Dialog,
    Button
  },
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    width: {
      type: String,
      default: '500px'
    },
    cancelLabel: {
      type: String,
      default: null
    },
    confirmLabel: {
      type: String,
      default: null
    },
    confirmIcon: {
      type: String,
      default: null
    },
    confirmButtonClass: {
      type: String,
      default: null
    },
    hideConfirm: {
      type: Boolean,
      default: false
    }
  },
  emits: ['update:modelValue', 'confirm']
};
</script>

<style scoped>
.dialog-content-modern {
  padding: 1rem 0;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

/* Dialog polish overrides */
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
}

:deep(.p-dialog-header .p-dialog-title) {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
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
</style>
