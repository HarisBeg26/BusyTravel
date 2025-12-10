<template>
  <div class="sus-questionnaire">
    <Dialog 
      v-model:visible="isDialogVisible" 
      modal 
      :style="{ width: '50rem' }" 
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      class="sus-dialog"
      :closable="false"
    >
      <template #header>
        <div class="sus-header">
          <i class="pi pi-check-square sus-icon"></i>
          <div class="sus-title-section">
            <h3>{{ $t('susQuestionnaire') || 'SUS Vprašalnik' }}</h3>
            <p>{{ $t('susDescription') || 'Ocenite vašo izkušnjo z uporabo te strani.' }}</p>
          </div>
        </div>
      </template>

      <div class="sus-content">
        <div class="sus-instructions">
          <p>{{ $t('susInstruction1') || 'Za vsako trditev izberite oceno, ki najbolje odraža vaše mnenje.' }}</p>
          <p><strong>1</strong> - {{ $t('stronglyDisagree') || 'sploh se ne strinjam' }}, <strong>5</strong> - {{ $t('stronglyAgree') || 'popolnoma se strinjam' }}</p>
        </div>

        <div class="sus-form">
          <div v-for="(question, index) in susQuestions" :key="index" class="sus-question">
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}</span>
              <p class="question-text">{{ $t(question.text) || question.text }}</p>
            </div>
            <div class="rating-scale">
              <div class="rating-buttons">
                <div v-for="n in 5" :key="n" class="rating-option">
                  <input type="radio" :id="`q${index}_${n}`" :name="`question_${index}`" :value="n" v-model="responses[index]" class="rating-input">
                  <label :for="`q${index}_${n}`" class="rating-label" :class="{ 'selected': responses[index] === n }">{{ n }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="form-actions">
          <Button :label="$t('cancel')" icon="pi pi-times" @click="closeQuestionnaire" class="p-button-text" />
          <Button :label="$t('submit')" icon="pi pi-check" @click="submitSUS" :disabled="!isFormValid || submitting" />
        </div>
      </template>
    </Dialog>

    <!-- Thank You Dialog -->
    <Dialog 
      v-model:visible="showThankYou" 
      modal 
      :header="$t('thankYou')"
      :style="{ width: '30rem' }" 
      class="thank-you-dialog"
    >
      <div class="thank-you-content">
        <i class="pi pi-thumbs-up-fill thank-you-icon"></i>
        <h3>{{ $t('submissionSuccess') }}</h3>
        <p>{{ $t('submissionMessage') }}</p>
        <div v-if="calculatedScore !== null" class="sus-score-display">
          <p>{{ $t('yourSusScore') }}: <strong>{{ calculatedScore.toFixed(1) }} / 100</strong></p>
        </div>
      </div>
      <template #footer>
        <Button :label="$t('close')" icon="pi pi-check" @click="closeThankYou" autofocus />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import abTestingService from '@/services/abTestingService.js';

export default {
  name: 'SUSQuestionnaire',
  components: {
    Dialog,
    Button
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    pageName: {
      type: String,
      default: 'unknown'
    }
  },
  emits: ['update:visible', 'submitted'],
  setup(props, { emit }) {
    const isDialogVisible = ref(props.visible);
    const responses = ref(Array(10).fill(null));
    const submitting = ref(false);
    const showThankYou = ref(false);
    const calculatedScore = ref(null);

    const susQuestions = [
        { text: 'sus_q1', positive: true },
        { text: 'sus_q2', positive: false },
        { text: 'sus_q3', positive: true },
        { text: 'sus_q4', positive: false },
        { text: 'sus_q5', positive: true },
        { text: 'sus_q6', positive: false },
        { text: 'sus_q7', positive: true },
        { text: 'sus_q8', positive: false },
        { text: 'sus_q9', positive: true },
        { text: 'sus_q10', positive: false }
    ];

    watch(() => props.visible, (newVal) => {
      isDialogVisible.value = newVal;
    });

    watch(isDialogVisible, (newVal) => {
      if (!newVal) {
        emit('update:visible', false);
      }
    });

    const isFormValid = computed(() => responses.value.every(response => response !== null));

    const resetForm = () => {
      responses.value.fill(null);
      calculatedScore.value = null;
      submitting.value = false;
    };

    const closeQuestionnaire = () => {
      resetForm();
      isDialogVisible.value = false;
    };

    const calculateSUSScore = () => {
      let score = 0;
      responses.value.forEach((response, index) => {
        const question = susQuestions[index];
        score += question.positive ? (response - 1) : (5 - response);
      });
      return score * 2.5;
    };

    const submitSUS = async () => {
      if (!isFormValid.value) return;
      submitting.value = true;

      const score = calculateSUSScore();
      calculatedScore.value = score;

      const susData = {
        score,
        responses: responses.value,
        pageName: props.pageName,
        variant: abTestingService.getUserVariant(props.pageName)
      };

      abTestingService.trackSUSSubmission(susData, props.pageName);
      
      // Optional: send to backend
      await sendSUSToBackend(susData);

      submitting.value = false;
      isDialogVisible.value = false;
      showThankYou.value = true;
      emit('submitted');
    };

    const sendSUSToBackend = async (susData) => {
        try {
            await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/sus`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(susData)
            });
        } catch (error) {
            console.error('Error sending SUS data to backend:', error);
        }
    };

    const closeThankYou = () => {
      showThankYou.value = false;
      resetForm();
    };

    return {
      isDialogVisible,
      responses,
      submitting,
      showThankYou,
      calculatedScore,
      susQuestions,
      isFormValid,
      closeQuestionnaire,
      submitSUS,
      closeThankYou
    };
  }
};
</script>

<style scoped>
/* Styles remain largely the same, with minor adjustments if needed */
.sus-dialog {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.sus-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sus-icon {
  font-size: 2rem;
  color: #667eea;
}

.sus-title-section h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
}

.sus-title-section p {
  margin: 0;
  color: #6c757d;
}

.sus-instructions {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border-left: 4px solid #667eea;
}

.sus-form {
  max-height: 55vh;
  overflow-y: auto;
  padding-right: 1rem;
}

.sus-question {
  margin-bottom: 1.5rem;
}

.question-header {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.question-number {
  background: #667eea;
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.rating-buttons {
  display: flex;
  justify-content: space-between;
}

.rating-input {
  display: none;
}

.rating-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: 2px solid #e9ecef;
  border-radius: 50%;
  cursor: pointer;
  font-weight: 600;
  color: #6c757d;
  transition: all 0.2s ease-in-out;
}

.rating-label:hover {
  border-color: #667eea;
  color: #667eea;
}

.rating-label.selected {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.thank-you-content {
  text-align: center;
  padding: 2rem;
}

.thank-you-icon {
  font-size: 3rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.sus-score-display {
  margin-top: 1.5rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}
</style>
