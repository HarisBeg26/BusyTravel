<template>
  <div class="testing-instructions">
    <Button 
      icon="pi pi-info-circle"
      :label="$t('testingInstructions') || 'Navodila za testiranje'"
      @click="showInstructions"
      class="instructions-button"
      outlined
    />

    <Dialog 
      v-model:visible="visible" 
      modal 
      :header="$t('testingInstructions') || 'Navodila za testiranje'"
      :style="{ width: '60rem' }" 
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      class="instructions-dialog"
    >
      <div class="instructions-content">
        <div class="instruction-section">
          <h3>{{ $t('task') || 'Naloga' }} 1: {{ $t('navigationAndAddTrip') || 'Navigacija in dodajanje novega potovanja' }}</h3>
          
          <div class="task-goal">
            <h4>{{ $t('goal') || 'Cilj' }}:</h4>
          </div>

          <div class="task-data">
          </div>

          <div class="task-steps">
          </div>
        </div>

        <Divider />

        <div class="instruction-section">
          <h3>{{ $t('task') || 'Naloga' }} 2: {{ $t('expenseManagement') || 'Upravljanje stroškov potovanja' }}</h3>
          
          <div class="task-goal">
          </div>

          <div class="task-data">
          </div>

          <div class="task-steps">
          </div>
        </div>

        <Divider />

        <div class="instruction-section">
          <h3>{{ $t('afterTasks') || 'Po končanih nalogah' }}</h3>
          
          <div class="after-tasks">
          </div>

          <div class="important-notes">
          </div>
        </div>
      </div>

      <template #footer>
        <div class="instructions-footer">
          <Button 
            icon="pi pi-play"
          />
          <Button 
            outlined
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import abTestingService from '@/services/abTestingService.js';

export default {
  name: 'TestingInstructions',
  components: {
    Dialog,
    Button,
    Divider
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    showInstructions() {
      this.visible = true;
      abTestingService.trackEvent('instructions_opened', {
        source: 'instructions_button'
      });
    },
    closeInstructions() {
      this.visible = false;
      abTestingService.trackEvent('instructions_closed', {
        action: 'close_button'
      });
    },
    startTesting() {
      this.visible = false;
      abTestingService.trackEvent('testing_started', {
        source: 'instructions_dialog'
      });
      
      // Show success message
      this.$toast?.add({
        severity: 'info',
        summary: this.$t('testingStarted') || 'Testiranje začeto',
        detail: this.$t('testingStartedMessage') || 'Sledimo vašemu napredku. Delajte v svojem tempu.',
        life: 5000
      });
    }
  }
};
</script>

<style scoped>
.instructions-button {
  border-color: #667eea;
  color: #667eea;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.instructions-button:hover {
  background: #667eea;
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.instructions-dialog {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.instructions-content {
  max-height: 70vh;
  overflow-y: auto;
  padding: 1rem 0;
}

.instruction-section {
  margin-bottom: 2rem;
}

.instruction-section h3 {
  color: #2c3e50;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  border-left: 4px solid #667eea;
  padding-left: 1rem;
}

.task-goal, .task-data, .task-steps, .after-tasks, .important-notes {
  margin-bottom: 1rem;
}

.task-goal h4, .task-data h4, .after-tasks h4, .important-notes h4 {
  color: #495057;
  font-size: 1rem;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.task-data h5 {
  color: #6c757d;
  font-size: 0.95rem;
  margin: 1rem 0 0.5rem 0;
  font-weight: 600;
}

.task-goal p, .task-steps p, .after-tasks p {
  color: #2c3e50;
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.task-data ul, .important-notes ul {
  color: #495057;
  line-height: 1.6;
  padding-left: 1.5rem;
}

.task-data li, .important-notes li {
  margin-bottom: 0.5rem;
}

.expense-data {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin: 0.5rem 0;
  border-left: 3px solid #667eea;
}

.expense-data ul {
  margin: 0;
}

.task-steps {
  background: #e3f2fd;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #2196f3;
}

.after-tasks {
  background: #fff3e0;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #ff9800;
}

.important-notes {
  background: #f3e5f5;
  padding: 1rem;
  border-radius: 8px;
  border-left: 3px solid #9c27b0;
}

.instructions-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.start-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  color: white;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
}

.close-button {
  color: #6c757d;
  border-color: #6c757d;
}

@media (max-width: 768px) {
  .instructions-content {
    padding: 0.5rem 0;
  }
  
  .instruction-section h3 {
    font-size: 1.1rem;
  }
  
  .instructions-footer {
    flex-direction: column-reverse;
    gap: 1rem;
  }
  
  .start-button, .close-button {
    width: 100%;
  }
}
</style>
