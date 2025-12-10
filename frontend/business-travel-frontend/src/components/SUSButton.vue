<template>
  <div class="sus-button-container">
    <Button 
      :label="$t('susButton')"
      icon="pi pi-star"
      class="sus-button p-button-rounded p-button-help"
      @click="openSusSurvey"
      :aria-label="$t('susTitle')"
    />
  </div>
</template>

<script>
import Button from 'primevue/button';
import { HotjarEvents } from '@/plugins/hotjar';

export default {
  name: 'SUSButton',
  components: {
    Button
  },
  props: {
    variant: {
      type: String,
      default: 'A',
      validator: (value) => ['A', 'B'].includes(value)
    },
    surveyId: {
      type: String,
      required: true
    }
  },
  methods: {
    openSusSurvey() {
      // Track that user opened SUS survey
      HotjarEvents.trackButtonClick('sus_survey_button', 'SUS', this.variant);
      HotjarEvents.trackFeatureUsage('sus_questionnaire', 'SUS', this.variant);
      
      // Tag the user with variant before triggering survey
      HotjarEvents.identifyUser(null, {
        sus_variant: this.variant,
        sus_timestamp: new Date().toISOString()
      });
      
      // Trigger Hotjar survey
      HotjarEvents.triggerSurvey(this.surveyId);
      
      console.log(`SUS Survey triggered for variant ${this.variant} with survey ID: ${this.surveyId}`);
    }
  }
};
</script>

<style scoped>
.sus-button-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
}

.sus-button {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  font-size: 1.2rem;
}

.sus-button:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.sus-button .p-button-icon {
  font-size: 1.5rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .sus-button-container {
    bottom: 20px;
    right: 20px;
  }
  
  .sus-button {
    width: 50px;
    height: 50px;
  }
}
</style>
