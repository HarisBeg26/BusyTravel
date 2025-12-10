<template>
  <div class="sus-questionnaire">
    <Dialog 
      :visible="visible" 
      @update:visible="$emit('update:visible', $event)"
      modal 
      :header="$t('susQuestionnaire') || 'SUS Questionnaire'"
      :style="{ width: '50rem' }" 
      :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
      class="sus-dialog"
      :closable="false"
    >
      <template #header>
        <div class="sus-header">
          <i class="pi pi-chart-line sus-icon"></i>
          <div class="sus-title-section">
            <h3>{{ $t('susQuestionnaire') || 'SUS Vprašalnik' }}</h3>
            <p>{{ $t('susDescription') || 'Prosimo, ocenite svojo izkušnjo z uporabo aplikacije.' }}</p>
          </div>
        </div>
      </template>

      <div class="sus-content">
        <div class="sus-instructions">
          <p><strong>{{ $t('susInstructions') || 'Navodila:' }}</strong></p>
          <p>{{ $t('susInstructionsText') || 'Za vsako trditev izberite oceno od 1 (se sploh ne strinjam) do 5 (se popolnoma strinjam).' }}</p>
        </div>

        <form @submit.prevent="submitSUS" class="sus-form">
          <div 
            v-for="(question, index) in susQuestions" 
            :key="index"
            class="sus-question"
          >
            <div class="question-header">
              <span class="question-number">{{ index + 1 }}.</span>
              <p class="question-text">{{ question.text }}</p>
            </div>
            
            <div class="rating-scale">
              <div class="scale-labels">
                <span class="scale-label">{{ $t('stronglyDisagree') || 'Se sploh ne strinjam' }}</span>
                <span class="scale-label">{{ $t('stronglyAgree') || 'Se popolnoma strinjam' }}</span>
              </div>
              <div class="rating-buttons">
                <div 
                  v-for="rating in 5" 
                  :key="rating"
                  class="rating-option"
                >
                  <input 
                    type="radio" 
                    :id="`q${index}_r${rating}`"
                    :name="`question_${index}`"
                    :value="rating"
                    v-model="responses[index]"
                    required
                    class="rating-input"
                  />
                  <label 
                    :for="`q${index}_r${rating}`"
                    class="rating-label"
                    :class="{ 'selected': responses[index] == rating }"
                  >
                    {{ rating }}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <Button 
              type="button"
              :label="$t('cancel') || 'Prekliči'"
              @click="closeQuestionnaire"
              class="cancel-button"
              outlined
            />
            <Button 
              type="submit"
              :label="$t('submit') || 'Pošlji'"
              :disabled="!isFormValid"
              class="submit-button"
              :loading="submitting"
            />
          </div>
        </form>
      </div>
    </Dialog>

    <!-- Thank You Dialog -->
    <Dialog 
      v-model:visible="showThankYou" 
      modal 
      :header="$t('thankYou') || 'Hvala!'"
      :style="{ width: '30rem' }" 
      class="thank-you-dialog"
    >
      <div class="thank-you-content">
        <div class="thank-you-icon">
          <i class="pi pi-check-circle"></i>
        </div>
        <h3>{{ $t('thankYouMessage') || 'Hvala za vaš odziv!' }}</h3>
        <p>{{ $t('thankYouDescription') || 'Vaše mnenje nam pomaga izboljšati aplikacijo.' }}</p>
        <div class="sus-score-display" v-if="calculatedScore !== null">
          <p><strong>{{ $t('yourScore') || 'Vaša ocena:' }} {{ calculatedScore }}/100</strong></p>
        </div>
      </div>
      <template #footer>
        <Button 
          :label="$t('close') || 'Zapri'"
          @click="closeThankYou"
          class="close-button"
        />
      </template>
    </Dialog>
  </div>
</template>

<script>
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
  data() {
    return {
      responses: Array(10).fill(null),
      submitting: false,
      showThankYou: false,
      calculatedScore: null,
      susQuestions: [
        {
          text: this.$t('sus1') || 'Mislim, da bi rad(a) pogosto uporabljal(a) ta sistem.',
          positive: true
        },
        {
          text: this.$t('sus2') || 'Sistem se mi zdi nepotrebno zapleten.',
          positive: false
        },
        {
          text: this.$t('sus3') || 'Mislim, da je sistem enostaven za uporabo.',
          positive: true
        },
        {
          text: this.$t('sus4') || 'Mislim, da bi potreboval(a) podporo tehničnega strokovnjaka, da bi lahko uporabljal(a) ta sistem.',
          positive: false
        },
        {
          text: this.$t('sus5') || 'Ugotovil(a) sem, da so različne funkcije v sistemu dobro integrirane.',
          positive: true
        },
        {
          text: this.$t('sus6') || 'Mislim, da je v sistemu preveč nedoslednosti.',
          positive: false
        },
        {
          text: this.$t('sus7') || 'Predstavljam si, da bi se večina ljudi naučila uporabljati ta sistem zelo hitro.',
          positive: true
        },
        {
          text: this.$t('sus8') || 'Sistem se mi zdi zelo okoren za uporabo.',
          positive: false
        },
        {
          text: this.$t('sus9') || 'Med uporabo sistema sem se počutil(a) zelo samozavestno.',
          positive: true
        },
        {
          text: this.$t('sus10') || 'Moral(a) sem se naučiti veliko stvari, preden sem lahko začel(a) uporabljati ta sistem.',
          positive: false
        }
      ]
    }
  },
  computed: {
    isFormValid() {
      return this.responses.every(response => response !== null);
    }
  },
  methods: {
    closeQuestionnaire() {
      this.$emit('update:visible', false);
      this.resetForm();
    },
    resetForm() {
      this.responses = Array(10).fill(null);
      this.submitting = false;
      this.showThankYou = false;
      this.calculatedScore = null;
    },
    calculateSUSScore() {
      let score = 0;
      
      this.responses.forEach((response, index) => {
        const question = this.susQuestions[index];
        let questionScore = 0;
        
        if (question.positive) {
          // For positive questions (odd numbered: 1,3,5,7,9), subtract 1 from rating
          questionScore = response - 1;
        } else {
          // For negative questions (even numbered: 2,4,6,8,10), subtract rating from 5
          questionScore = 5 - response;
        }
        
        score += questionScore;
      });
      
      // Multiply by 2.5 to get score out of 100
      return score * 2.5;
    },
    async submitSUS() {
      this.submitting = true;
      
      try {
        // Calculate SUS score
        this.calculatedScore = this.calculateSUSScore();
        
        // Prepare submission data
        const susData = {
          pageName: this.pageName,
          variant: abTestingService.getUserVariant(this.pageName),
          responses: this.responses,
          score: this.calculatedScore,
          questions: this.susQuestions.map(q => ({ text: q.text, positive: q.positive })),
          timestamp: Date.now(),
          sessionId: abTestingService.getSessionId()
        };
        
        // Track SUS submission
        abTestingService.trackSUSSubmission(this.responses, this.pageName, {
          score: this.calculatedScore
        });
        
        // Send to backend
        await this.sendSUSToBackend(susData);
        
        // Show thank you message
        this.showThankYou = true;
        this.$emit('update:visible', false);
        this.$emit('submitted', susData);
        
      } catch (error) {
        console.error('Error submitting SUS questionnaire:', error);
        this.$toast?.add({
          severity: 'error',
          summary: 'Napaka',
          detail: 'Napaka pri pošiljanju vprašalnika. Poskusite znova.',
          life: 5000
        });
      } finally {
        this.submitting = false;
      }
    },
    async sendSUSToBackend(susData) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/analytics/sus`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(susData)
        });
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        console.log('SUS data sent successfully:', result);
        
      } catch (error) {
        console.error('Error sending SUS data to backend:', error);
        // Still show success to user since tracking was completed
      }
    },
    closeThankYou() {
      this.showThankYou = false;
      this.resetForm();
    }
  }
};
</script>

<style scoped>
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
  background: rgba(102, 126, 234, 0.1);
  padding: 1rem;
  border-radius: 50%;
}

.sus-title-section h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.sus-title-section p {
  margin: 0;
  color: #6c757d;
  font-size: 1rem;
}

.sus-content {
  padding: 1rem 0;
}

.sus-instructions {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border-left: 4px solid #667eea;
}

.sus-instructions p {
  margin: 0.5rem 0;
  color: #2c3e50;
}

.sus-form {
  max-height: 60vh;
  overflow-y: auto;
}

.sus-question {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  border: 2px solid #f1f3f4;
  transition: border-color 0.3s ease;
}

.sus-question:hover {
  border-color: #e9ecef;
}

.question-header {
  display: flex;
  align-items: flex-start;
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
  font-size: 0.875rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.question-text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.5;
  color: #2c3e50;
  font-weight: 500;
}

.rating-scale {
  margin-left: 2rem;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.scale-label {
  font-size: 0.875rem;
  color: #6c757d;
  font-weight: 500;
}

.rating-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.rating-option {
  flex: 1;
  display: flex;
  justify-content: center;
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
  transition: all 0.3s ease;
  background: white;
}

.rating-label:hover {
  border-color: #667eea;
  color: #667eea;
  transform: scale(1.05);
}

.rating-label.selected {
  border-color: #667eea;
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
}

.cancel-button {
  border: 2px solid #6c757d;
  color: #6c757d;
}

.submit-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  color: white;
}

.submit-button:disabled {
  background: #adb5bd;
  cursor: not-allowed;
}

.thank-you-dialog {
  text-align: center;
}

.thank-you-content {
  padding: 1rem 0;
}

.thank-you-icon {
  font-size: 3rem;
  color: #28a745;
  margin-bottom: 1rem;
}

.thank-you-content h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.thank-you-content p {
  color: #6c757d;
  margin-bottom: 1rem;
}

.sus-score-display {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-top: 1rem;
}

.sus-score-display p {
  margin: 0;
  color: #667eea;
  font-size: 1.1rem;
}

.close-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  color: white;
}

@media (max-width: 768px) {
  .sus-header {
    flex-direction: column;
    text-align: center;
  }
  
  .rating-scale {
    margin-left: 0;
  }
  
  .rating-buttons {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .rating-label {
    width: 35px;
    height: 35px;
  }
  
  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>