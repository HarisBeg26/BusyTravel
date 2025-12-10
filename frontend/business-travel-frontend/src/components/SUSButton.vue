<template>
  <div class="sus-button-container">
    <Button 
      icon="pi pi-star"
      class="sus-button p-button-rounded p-button-help"
      @click="openSusSurvey"
      :aria-label="$t('susTitle')"
      v-tooltip.left="$t('susButton')"
    />
  </div>
</template>

<script>
import Button from 'primevue/button';
import Tooltip from 'primevue/tooltip';

export default {
  name: 'SUSButton',
  components: {
    Button
  },
  directives: {
    tooltip: Tooltip
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
      // Your 1ka survey URL
      const surveyUrl = 'https://1ka.arnes.si/a/3b920b7b';
      
      // Track that user opened SUS survey (for ContentSquare)
      console.log(`Opening SUS survey for variant ${this.variant}: ${this.surveyId}`);
      
      // Track event in ContentSquare if available
      if (window._uxa && typeof window._uxa.push === 'function') {
        window._uxa.push(['trackEvent', 'SUS_Survey_Open', {
          variant: this.variant,
          survey_id: this.surveyId,
          timestamp: new Date().toISOString()
        }]);
      }
      
      // Open survey in new tab
      window.open(surveyUrl, '_blank', 'noopener,noreferrer');
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
  width: 56px;
  height: 56px;
  border-radius: 50% !important;
  box-shadow: 0 4px 16px rgba(103, 58, 183, 0.4);
  transition: all 0.3s ease;
  font-size: 1.2rem;
  background: linear-gradient(135deg, #673ab7 0%, #9c27b0 100%);
  border: none;
}

.sus-button:hover {
  transform: scale(1.1) translateY(-2px);
  box-shadow: 0 6px 20px rgba(103, 58, 183, 0.6);
  background: linear-gradient(135deg, #7e57c2 0%, #ab47bc 100%);
}

.sus-button:active {
  transform: scale(0.95);
}

.sus-button .p-button-icon {
  font-size: 1.5rem;
  color: white;
}

/* Pulse animation */
@keyframes pulse {
  0% {
    box-shadow: 0 4px 16px rgba(103, 58, 183, 0.4);
  }
  50% {
    box-shadow: 0 4px 20px rgba(103, 58, 183, 0.6), 0 0 0 8px rgba(103, 58, 183, 0.1);
  }
  100% {
    box-shadow: 0 4px 16px rgba(103, 58, 183, 0.4);
  }
}

.sus-button {
  animation: pulse 3s ease-in-out infinite;
}

/* Responsive design */
@media (max-width: 768px) {
  .sus-button-container {
    bottom: 20px;
    right: 20px;
  }
  
  .sus-button {
    width: 48px;
    height: 48px;
  }
  
  .sus-button .p-button-icon {
    font-size: 1.2rem;
  }
}

/* Print hide */
@media print {
  .sus-button-container {
    display: none;
  }
}
</style>
