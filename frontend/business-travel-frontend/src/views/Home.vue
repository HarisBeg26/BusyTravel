<template>
  <div class="home-page">
    <!-- SUS Questionnaire Button -->
    <div class="sus-trigger">
      <Button
        icon="pi pi-star"
        :label="$t('ratePage') || 'Ocenite stran'"
        @click="showSUSQuestionnaire"
        class="sus-button"
        outlined
      />
    </div>

    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('welcomeMessage') }}</h1>
        <p class="hero-subtitle">Manage your business travels and expenses efficiently</p>
      </div>
    </div>

    <div class="cards-container">
      <Card class="feature-card trips-card" @click="goToTravels">
        <template #header>
          <div class="card-icon-wrapper trips-icon">
            <i class="pi pi-map-marker"></i>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <h3 class="card-title">{{ $t('travels') }}</h3>
            <p class="card-description">{{ $t('travelsDescription') }}</p>
          </div>
        </template>
        <template #footer>
          <Button
            :label="$t('goToTravels')"
            icon="pi pi-arrow-right"
            iconPos="right"
            class="gradient-button-primary feature-button"
            @click="trackButtonClick('goToTravels')"
          />
        </template>
      </Card>

      <Card class="feature-card expenses-card" @click="goToExpenses">
        <template #header>
          <div class="card-icon-wrapper expenses-icon">
            <i class="pi pi-wallet"></i>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <h3 class="card-title">{{ $t('expenses') }}</h3>
            <p class="card-description">{{ $t('expensesDescription') }}</p>
          </div>
        </template>
        <template #footer>
          <Button
            :label="$t('goToExpenses')"
            icon="pi pi-arrow-right"
            iconPos="right"
            class="gradient-button-secondary feature-button"
            @click="trackButtonClick('goToExpenses')"
          />
        </template>
      </Card>

      <Card class="feature-card charts-card" @click="goToChart">
        <template #header>
          <div class="card-icon-wrapper charts-icon">
            <i class="pi pi-chart-bar"></i>
          </div>
        </template>
        <template #content>
          <div class="card-content">
            <h3 class="card-title">{{ $t('charts') }}</h3>
            <p class="card-description">{{ $t('chartsDescription') }}</p>
          </div>
        </template>
        <template #footer>
          <Button
            :label="$t('goToCharts')"
            icon="pi pi-arrow-right"
            iconPos="right"
            class="gradient-button-tertiary feature-button"
            @click="trackButtonClick('goToCharts')"
          />
        </template>
      </Card>
    </div>

    <!-- SUS Questionnaire Component -->
    <SUSQuestionnaire
      v-model:visible="susVisible"
      page-name="home"
      @submitted="onSUSSubmitted"
    />
  </div>
</template>

<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import SUSQuestionnaire from '@/components/SUSQuestionnaire.vue';
import abTestingService from '@/services/abTestingService.js';

export default {
  name: "HomePage",
  components: {
    Card,
    Button,
    SUSQuestionnaire
  },
  data() {
    return {
      susVisible: false
    }
  },
  mounted() {
    // Track page view
    abTestingService.trackPageView('home');
  },
  methods: {
    goToTravels() {
      this.trackButtonClick('goToTravels');
      this.$router.push("/trips");
    },
    goToExpenses() {
      this.trackButtonClick('goToExpenses');
      this.$router.push("/expenses");
    },
    goToChart() {
      this.trackButtonClick('goToCharts');
      this.$router.push("/statistics");
    },
    trackButtonClick(buttonName) {
      abTestingService.trackButtonClick(buttonName, 'home');
    },
    showSUSQuestionnaire() {
      this.susVisible = true;
      abTestingService.trackButtonClick('sus_questionnaire_open', 'home');
    },
    onSUSSubmitted(data) {
      console.log('SUS questionnaire submitted:', data);
      this.$toast?.add({
        severity: 'success',
        summary: 'Hvala!',
        detail: `Vaš odgovor je bil uspešno poslan. Ocena: ${data.score}/100`,
        life: 5000
      });
    }
  }
};
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 80px);
  padding: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}

.sus-trigger {
  position: fixed;
  top: 100px;
  right: 2rem;
  z-index: 1000;
}

.sus-button {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #667eea;
  color: #667eea;
  font-weight: 600;
  backdrop-filter: blur(10px);
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  transition: all 0.3s ease;
}

.sus-button:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.hero-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  padding: 4rem 2rem;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" fill="white" opacity="0.1"><polygon points="0,0 1000,80 1000,100 0,100"/></svg>') no-repeat bottom;
  background-size: cover;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.4rem;
  opacity: 0.95;
  font-weight: 300;
  line-height: 1.6;
}

.cards-container {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 4rem 2rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
}

.feature-card {
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  border: none !important;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  overflow: hidden;
  position: relative;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
}

.card-icon-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 180px;
  font-size: 4.5rem;
  border-radius: 16px 16px 0 0;
  position: relative;
  overflow: hidden;
}

.card-icon-wrapper::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
}

.card-icon-wrapper i {
  position: relative;
  z-index: 1;
  color: white;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.trips-icon {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.expenses-icon {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.charts-icon {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.card-content {
  padding: 2rem;
  text-align: center;
}

.card-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #2d3748;
}

.card-description {
  color: #718096;
  line-height: 1.6;
  font-size: 1.1rem;
}

.feature-button {
  width: 100%;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .cards-container {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
    gap: 1.5rem;
  }

  .card-icon-wrapper {
    height: 140px;
    font-size: 3.5rem;
  }

  .card-content {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 2rem 1rem;
  }

  .hero-title {
    font-size: 2rem;
  }
}
</style>
