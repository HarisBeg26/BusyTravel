<template>
  <div class="home-page-b">
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

    <!-- Breadcrumb Navigation -->
    <div class="breadcrumb-container">
      <Breadcrumb :model="breadcrumbItems" class="custom-breadcrumb">
        <template #item="{ item }">
          <router-link v-if="item.route" :to="item.route" class="breadcrumb-link">
            <i :class="item.icon" v-if="item.icon"></i>
            {{ item.label }}
          </router-link>
          <span v-else>
            <i :class="item.icon" v-if="item.icon"></i>
            {{ item.label }}
          </span>
        </template>
      </Breadcrumb>
    </div>

    <!-- Sidebar Navigation Layout -->
    <div class="main-layout">
      <div class="sidebar-nav">
        <div class="sidebar-header">
          <h2 class="sidebar-title">{{ $t('quickActions') }}</h2>
        </div>
        <div class="sidebar-menu">
          <div 
            class="sidebar-item trips-item"
            @click="goToTravels"
          >
            <div class="sidebar-icon">
              <i class="pi pi-map-marker"></i>
            </div>
            <div class="sidebar-content">
              <h4>{{ $t('travels') }}</h4>
              <span class="sidebar-count">{{ tripsCount }} {{ $t('active') }}</span>
            </div>
            <i class="pi pi-chevron-right sidebar-arrow"></i>
          </div>

          <div 
            class="sidebar-item expenses-item"
            @click="goToExpenses"
          >
            <div class="sidebar-icon">
              <i class="pi pi-wallet"></i>
            </div>
            <div class="sidebar-content">
              <h4>{{ $t('expenses') }}</h4>
              <span class="sidebar-count">{{ expensesCount }} {{ $t('recent') }}</span>
            </div>
            <i class="pi pi-chevron-right sidebar-arrow"></i>
          </div>

          <div 
            class="sidebar-item charts-item"
            @click="goToChart"
          >
            <div class="sidebar-icon">
              <i class="pi pi-chart-bar"></i>
            </div>
            <div class="sidebar-content">
              <h4>{{ $t('statistics') }}</h4>
              <span class="sidebar-count">{{ $t('viewReports') }}</span>
            </div>
            <i class="pi pi-chevron-right sidebar-arrow"></i>
          </div>
        </div>

        <!-- Quick Add Section -->
        <div class="quick-add-section">
          <h3 class="quick-add-title">{{ $t('quickAdd') }}</h3>
          <div class="quick-add-buttons">
            <Button
              :label="$t('addTrip')"
              icon="pi pi-plus"
              @click="goToAddTrip"
              class="quick-button trip-button"
              size="small"
            />
            <Button
              :label="$t('addExpense')"
              icon="pi pi-plus"
              @click="goToAddExpense"
              class="quick-button expense-button"
              size="small"
            />
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="main-content">
        <div class="welcome-section">
          <div class="welcome-header">
            <h1 class="main-title">{{ $t('welcomeMessage') }}</h1>
            <p class="main-subtitle">{{ $t('dashboardOverview') }}</p>
          </div>
        </div>

        <!-- Recent Activity Tab -->
        <div class="activity-section">
          <TabView class="custom-tabs">
            <TabPanel :header="$t('recentTrips')">
              <div class="recent-content">
                <div v-if="recentTrips.length > 0" class="recent-list">
                  <div 
                    v-for="trip in recentTrips" 
                    :key="trip.id"
                    class="recent-item"
                    @click="viewTrip(trip)"
                  >
                    <div class="recent-icon">
                      <i class="pi pi-map-marker"></i>
                    </div>
                    <div class="recent-details">
                      <h4>{{ trip.destination }}</h4>
                      <span class="recent-date">{{ formatDate(trip.startDate) }}</span>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <i class="pi pi-info-circle"></i>
                  <p>{{ $t('noRecentTrips') }}</p>
                  <Button 
                    :label="$t('addFirstTrip')" 
                    @click="goToAddTrip"
                    class="gradient-button-primary"
                  />
                </div>
              </div>
            </TabPanel>

            <TabPanel :header="$t('recentExpenses')">
              <div class="recent-content">
                <div v-if="recentExpenses.length > 0" class="recent-list">
                  <div 
                    v-for="expense in recentExpenses" 
                    :key="expense.id"
                    class="recent-item"
                  >
                    <div class="recent-icon">
                      <i class="pi pi-wallet"></i>
                    </div>
                    <div class="recent-details">
                      <h4>{{ expense.description }}</h4>
                      <span class="recent-amount">{{ expense.amount }} €</span>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <i class="pi pi-info-circle"></i>
                  <p>{{ $t('noRecentExpenses') }}</p>
                  <Button 
                    :label="$t('addFirstExpense')" 
                    @click="goToAddExpense"
                    class="gradient-button-secondary"
                  />
                </div>
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
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
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import SUSQuestionnaire from '@/components/SUSQuestionnaire.vue';
import abTestingService from '@/services/abTestingService.js';
import axios from 'axios';

export default {
  name: "HomeBPage",
  components: {
    Button,
    Breadcrumb,
    TabView,
    TabPanel,
    SUSQuestionnaire
  },
  data() {
    return {
      susVisible: false,
      tripsCount: 0,
      expensesCount: 0,
      recentTrips: [],
      recentExpenses: [],
      breadcrumbItems: [
        {
          label: this.$t('Home') || 'Home',
          icon: 'pi pi-home'
        }
      ]
    }
  },
  async mounted() {
    // Track page view
    abTestingService.trackPageView('home');
    await this.loadDashboardData();
  },
  methods: {
    async loadDashboardData() {
      try {
        // Load recent trips
        const tripsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/trips`);
        this.recentTrips = tripsResponse.data.slice(0, 3); // Show only 3 most recent
        this.tripsCount = tripsResponse.data.length;
        
        // Load recent expenses
        const expensesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/expenses`);
        this.recentExpenses = expensesResponse.data.slice(0, 3); // Show only 3 most recent
        this.expensesCount = expensesResponse.data.length;
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    },
    goToTravels() {
      abTestingService.trackButtonClick('goToTravels', 'home');
      this.$router.push("/trips");
    },
    goToExpenses() {
      abTestingService.trackButtonClick('goToExpenses', 'home');
      this.$router.push("/expenses");
    },
    goToChart() {
      abTestingService.trackButtonClick('goToCharts', 'home');
      this.$router.push("/statistics");
    },
    goToAddTrip() {
      abTestingService.trackButtonClick('goToAddTrip', 'home');
      this.$router.push("/add-trip");
    },
    goToAddExpense() {
      abTestingService.trackButtonClick('goToAddExpense', 'home');
      this.$router.push("/add-expense");
    },
    viewTrip(trip) {
      // Navigate to trip details or trips list
      this.$router.push("/trips");
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString(this.$i18n.locale);
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
.home-page-b {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 0;
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

.breadcrumb-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.custom-breadcrumb {
  background: transparent;
  border: none;
  padding: 0;
}

.breadcrumb-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.main-layout {
  display: flex;
  min-height: calc(100vh - 80px);
}

.sidebar-nav {
  width: 300px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(0, 0, 0, 0.1);
  padding: 2rem 1.5rem;
}

.sidebar-header {
  margin-bottom: 2rem;
}

.sidebar-title {
  color: #2c3e50;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.sidebar-menu {
  margin-bottom: 2rem;
}

.sidebar-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.sidebar-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.trips-item:hover {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.expenses-item:hover {
  background: linear-gradient(45deg, #f093fb, #f5576c);
  color: white;
}

.charts-item:hover {
  background: linear-gradient(45deg, #4facfe, #00f2fe);
  color: white;
}

.sidebar-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background: #f8f9fa;
  transition: background 0.3s ease;
}

.sidebar-item:hover .sidebar-icon {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-icon i {
  font-size: 1.2rem;
  color: #667eea;
}

.sidebar-item:hover .sidebar-icon i {
  color: white;
}

.sidebar-content {
  flex: 1;
}

.sidebar-content h4 {
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
  font-weight: 600;
}

.sidebar-count {
  font-size: 0.875rem;
  opacity: 0.7;
}

.sidebar-arrow {
  color: #667eea;
  transition: color 0.3s ease;
}

.sidebar-item:hover .sidebar-arrow {
  color: white;
}

.quick-add-section {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 1.5rem;
}

.quick-add-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.quick-add-buttons {
  display: flex;
  gap: 0.5rem;
  flex-direction: column;
}

.quick-button {
  justify-content: flex-start;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.trip-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.expense-button {
  background: linear-gradient(45deg, #f093fb, #f5576c);
  color: white;
}

.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-header {
  text-align: center;
  color: white;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.main-subtitle {
  font-size: 1.125rem;
  opacity: 0.9;
  margin: 0;
}

.activity-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.custom-tabs {
  border: none;
}

.recent-content {
  padding: 1rem 0;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.recent-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.recent-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.recent-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  color: white;
}

.recent-details h4 {
  margin: 0 0 0.25rem 0;
  font-weight: 600;
  color: #2c3e50;
}

.recent-date, .recent-amount {
  font-size: 0.875rem;
  color: #666;
  font-weight: 500;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.gradient-button-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  color: white;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

.gradient-button-secondary {
  background: linear-gradient(45deg, #f093fb, #f5576c);
  border: none;
  color: white;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  
  .sidebar-nav {
    width: 100%;
    padding: 1rem;
  }
  
  .sidebar-menu {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .main-content {
    padding: 1rem;
  }
  
  .main-title {
    font-size: 2rem;
  }
}
</style>