<template>
  <div class="home-page-variant-b">
    <!-- Breadcrumbs Navigation -->
    <div class="breadcrumb-wrapper">
      <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="custom-breadcrumb" />
    </div>

    <div class="layout-container">
      <!-- Sidebar Quick Navigation -->
      <aside class="sidebar-navigation">
        <div class="sidebar-header">
          <i class="pi pi-compass sidebar-icon"></i>
          <h2 class="sidebar-title">{{ $t('welcomeMessage') }}</h2>
        </div>

        <div class="quick-actions">
          <h3 class="quick-actions-title">Quick Actions</h3>
          
          <div class="action-item" @click="goToTravels">
            <div class="action-icon trips-color">
              <i class="pi pi-map-marker"></i>
            </div>
            <div class="action-content">
              <h4 class="action-title">{{ $t('travels') }}</h4>
              <p class="action-description">{{ $t('travelsDescription') }}</p>
              <Button
                :label="$t('goToTravels')"
                icon="pi pi-arrow-right"
                iconPos="right"
                class="p-button-sm p-button-text action-btn"
              />
            </div>
          </div>

          <div class="action-item" @click="goToExpenses">
            <div class="action-icon expenses-color">
              <i class="pi pi-wallet"></i>
            </div>
            <div class="action-content">
              <h4 class="action-title">{{ $t('expenses') }}</h4>
              <p class="action-description">{{ $t('expensesDescription') }}</p>
              <Button
                :label="$t('goToExpenses')"
                icon="pi pi-arrow-right"
                iconPos="right"
                class="p-button-sm p-button-text action-btn"
              />
            </div>
          </div>

          <div class="action-item" @click="goToChart">
            <div class="action-icon charts-color">
              <i class="pi pi-chart-bar"></i>
            </div>
            <div class="action-content">
              <h4 class="action-title">{{ $t('charts') }}</h4>
              <p class="action-description">{{ $t('chartsDescription') }}</p>
              <Button
                :label="$t('goToCharts')"
                icon="pi pi-arrow-right"
                iconPos="right"
                class="p-button-sm p-button-text action-btn"
              />
            </div>
          </div>
        </div>

        <div class="sidebar-footer">
          <Divider />
          <div class="recent-activity">
            <h4 class="recent-title">
              <i class="pi pi-clock"></i> Recent Activity
            </h4>
            <ul class="activity-list">
              <li class="activity-item">
                <i class="pi pi-map-marker activity-icon"></i>
                <span>Last trip added</span>
              </li>
              <li class="activity-item">
                <i class="pi pi-wallet activity-icon"></i>
                <span>Last expense recorded</span>
              </li>
            </ul>
          </div>
        </div>
      </aside>

      <!-- Main Content Area with Summary Cards -->
      <main class="main-content">
        <div class="welcome-banner">
          <h1 class="banner-title">Welcome to Business Travel Tracker</h1>
          <p class="banner-subtitle">Manage your business travels and expenses efficiently</p>
        </div>

        <div class="summary-grid">
          <Card class="summary-card trips-summary">
            <template #content>
              <div class="summary-content">
                <div class="summary-icon trips-bg">
                  <i class="pi pi-map-marker"></i>
                </div>
                <div class="summary-details">
                  <h3 class="summary-label">Active Trips</h3>
                  <p class="summary-value">-</p>
                  <Button
                    label="View All"
                    icon="pi pi-external-link"
                    iconPos="right"
                    class="p-button-sm p-button-outlined summary-action"
                    @click="goToTravels"
                  />
                </div>
              </div>
            </template>
          </Card>

          <Card class="summary-card expenses-summary">
            <template #content>
              <div class="summary-content">
                <div class="summary-icon expenses-bg">
                  <i class="pi pi-wallet"></i>
                </div>
                <div class="summary-details">
                  <h3 class="summary-label">Total Expenses</h3>
                  <p class="summary-value">-</p>
                  <Button
                    label="View All"
                    icon="pi pi-external-link"
                    iconPos="right"
                    class="p-button-sm p-button-outlined summary-action"
                    @click="goToExpenses"
                  />
                </div>
              </div>
            </template>
          </Card>

          <Card class="summary-card charts-summary">
            <template #content>
              <div class="summary-content">
                <div class="summary-icon charts-bg">
                  <i class="pi pi-chart-bar"></i>
                </div>
                <div class="summary-details">
                  <h3 class="summary-label">Statistics</h3>
                  <p class="summary-value">View Reports</p>
                  <Button
                    label="View Charts"
                    icon="pi pi-external-link"
                    iconPos="right"
                    class="p-button-sm p-button-outlined summary-action"
                    @click="goToChart"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>

        <div class="info-panel">
          <Card>
            <template #header>
              <div class="info-header">
                <i class="pi pi-info-circle"></i>
                <h3>Getting Started</h3>
              </div>
            </template>
            <template #content>
              <div class="info-content">
                <p>Use the sidebar for quick navigation or explore the summary cards above.</p>
                <ul class="tips-list">
                  <li><i class="pi pi-check-circle"></i> Track your business trips efficiently</li>
                  <li><i class="pi pi-check-circle"></i> Record all expenses with ease</li>
                  <li><i class="pi pi-check-circle"></i> View detailed statistics and reports</li>
                </ul>
              </div>
            </template>
          </Card>
        </div>
      </main>
    </div>

    <!-- SUS Questionnaire Button for Variant B -->
    <SUSButton variant="B" surveyId="sus_home_variant_b" />
  </div>
</template>

<script>
import Card from 'primevue/card';
import Button from 'primevue/button';
import Breadcrumb from 'primevue/breadcrumb';
import Divider from 'primevue/divider';
import SUSButton from '@/components/SUSButton.vue';
import { HotjarEvents } from '@/plugins/hotjar';

export default {
  name: "HomePageVariantB",
  components: {
    Card,
    Button,
    Breadcrumb,
    Divider,
    SUSButton
  },
  data() {
    return {
      breadcrumbHome: { icon: 'pi pi-home', to: '/' },
      breadcrumbItems: [
        { label: 'Dashboard', disabled: true }
      ],
      pageLoadTime: null
    };
  },
  mounted() {
    // Track page view for Home Variant B
    HotjarEvents.trackPageView('Home', 'B');
    HotjarEvents.trackABTestAssignment('home_page_test', 'B');
    HotjarEvents.trackFeatureUsage('sidebar_navigation', 'Home', 'B');
    
    // Record page load time
    this.pageLoadTime = Date.now();
  },
  beforeUnmount() {
    // Track time spent on page
    if (this.pageLoadTime) {
      const timeOnPage = Math.round((Date.now() - this.pageLoadTime) / 1000);
      HotjarEvents.trackTimeOnPage('Home', 'B', timeOnPage);
    }
  },
  methods: {
    goToTravels() {
      HotjarEvents.trackButtonClick('go_to_travels_sidebar', 'Home', 'B');
      HotjarEvents.trackNavigation('Home', 'TripsList', 'B');
      this.$router.push("/trips");
    },
    goToExpenses() {
      HotjarEvents.trackButtonClick('go_to_expenses_sidebar', 'Home', 'B');
      HotjarEvents.trackNavigation('Home', 'ExpensesList', 'B');
      this.$router.push("/expenses");
    },
    goToChart() {
      HotjarEvents.trackButtonClick('go_to_charts_sidebar', 'Home', 'B');
      HotjarEvents.trackNavigation('Home', 'Statistics', 'B');
      this.$router.push("/statistics");
    }
  }
};
</script>

<style scoped>
.home-page-variant-b {
  min-height: calc(100vh - 80px);
  background: #f8f9fa;
}

.breadcrumb-wrapper {
  background: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.custom-breadcrumb {
  background: transparent !important;
  border: none !important;
  padding: 0 !important;
}

.layout-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 0;
  min-height: calc(100vh - 140px);
}

/* Sidebar Styles */
.sidebar-navigation {
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 2rem 1.5rem;
  overflow-y: auto;
  position: sticky;
  top: 80px;
  height: calc(100vh - 140px);
}

.sidebar-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.sidebar-icon {
  font-size: 3rem;
  color: #667eea;
  margin-bottom: 1rem;
  display: block;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0;
}

.quick-actions-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 1.5rem;
}

.action-item {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #f9fafb;
  border: 1px solid transparent;
}

.action-item:hover {
  background: white;
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
  transform: translateX(4px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
  flex-shrink: 0;
}

.trips-color {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.expenses-color {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.charts-color {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.action-content {
  flex: 1;
}

.action-title {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 0.25rem 0;
}

.action-description {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.action-btn {
  padding: 0.25rem 0.5rem !important;
  font-size: 0.875rem !important;
}

.sidebar-footer {
  margin-top: 2rem;
}

.recent-activity {
  padding-top: 1rem;
}

.recent-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: #4b5563;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  padding: 0.75rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.activity-icon {
  color: #9ca3af;
}

/* Main Content Styles */
.main-content {
  padding: 2rem;
  overflow-y: auto;
}

.welcome-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem 2rem;
  border-radius: 16px;
  color: white;
  text-align: center;
  margin-bottom: 2rem;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.banner-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0 0 1rem 0;
}

.banner-subtitle {
  font-size: 1.25rem;
  opacity: 0.95;
  margin: 0;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  border: none !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  transition: all 0.3s ease;
}

.summary-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
  transform: translateY(-4px);
}

.summary-content {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.summary-icon {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  flex-shrink: 0;
}

.trips-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.expenses-bg {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.charts-bg {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.summary-details {
  flex: 1;
}

.summary-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  margin: 0 0 0.5rem 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.summary-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2d3748;
  margin: 0 0 1rem 0;
}

.summary-action {
  font-size: 0.875rem !important;
}

.info-panel {
  margin-top: 2rem;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.info-header i {
  font-size: 1.5rem;
}

.info-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.info-content {
  padding: 1rem 0;
}

.info-content p {
  color: #4b5563;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.tips-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.tips-list li {
  padding: 0.75rem 0;
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
}

.tips-list li:last-child {
  border-bottom: none;
}

.tips-list i {
  color: #10b981;
  font-size: 1.1rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .layout-container {
    grid-template-columns: 280px 1fr;
  }

  .sidebar-navigation {
    padding: 1.5rem 1rem;
  }
}

@media (max-width: 768px) {
  .layout-container {
    grid-template-columns: 1fr;
  }

  .sidebar-navigation {
    position: static;
    height: auto;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }

  .main-content {
    padding: 1.5rem 1rem;
  }

  .banner-title {
    font-size: 1.75rem;
  }

  .banner-subtitle {
    font-size: 1rem;
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
