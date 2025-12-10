<template>
  <div class="home-b-layout">
    <!-- Sidebar Navigation -->
    <div class="sidebar">
      <div class="sidebar-header">
        <i class="pi pi-briefcase"></i>
        <span class="sidebar-title">{{ $t('appName') || 'BusyTravel' }}</span>
      </div>
      <ul class="sidebar-nav">
        <li v-for="item in navItems" :key="item.name" @click="navigate(item.route, 'sidebar_click')" :class="{ 'active': $route.path === item.route }">
          <i :class="item.icon"></i>
          <span>{{ $t(item.name) || item.name }}</span>
        </li>
      </ul>
      <div class="sidebar-footer">
        <p>&copy; 2025 BusyTravel</p>
      </div>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="main-header">
        <h1>{{ $t('dashboard') || 'Dashboard' }}</h1>
        <p>{{ $t('welcomeMessage') }}</p>
      </div>

      <!-- TabView for Recent Activities -->
      <TabView class="dashboard-tabs">
        <TabPanel :header="$t('recentTrips') || 'Recent Trips'">
          <div class="tab-content">
            <p>Prikaz zadnjih dodanih potovanj.</p>
            <!-- Placeholder for recent trips list -->
          </div>
        </TabPanel>
        <TabPanel :header="$t('recentExpenses') || 'Recent Expenses'">
          <div class="tab-content">
            <p>Prikaz zadnjih dodanih stroškov.</p>
            <!-- Placeholder for recent expenses list -->
          </div>
        </TabPanel>
        <TabPanel :header="$t('quickActions') || 'Quick Actions'">
          <div class="tab-content quick-actions">
            <Button :label="$t('addTrip')" icon="pi pi-plus" @click="navigate('/add-trip', 'quick_action_add_trip')" class="p-button-success" />
            <Button :label="$t('addExpense')" icon="pi pi-dollar" @click="navigate('/add-expense', 'quick_action_add_expense')" class="p-button-info" />
          </div>
        </TabPanel>
      </TabView>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';
import abTestingService from '@/services/abTestingService.js';

export default {
  name: "HomeBPage",
  components: {
    TabView,
    TabPanel,
    Button
  },
  setup() {
    const router = useRouter();
    const navItems = [
      { name: 'home', route: '/', icon: 'pi pi-home' },
      { name: 'travels', route: '/trips', icon: 'pi pi-map-marker' },
      { name: 'expenses', route: '/expenses', icon: 'pi pi-wallet' },
      { name: 'statistics', route: '/statistics', icon: 'pi pi-chart-bar' }
    ];

    const navigate = (route, source) => {
      abTestingService.trackButtonClick(source, 'home');
      router.push(route);
    };

    return {
      navItems,
      navigate
    };
  }
};
</script>

<style scoped>
.home-b-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f4f7f9;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background: linear-gradient(180deg, #2c3e50, #34495e);
  color: #ecf0f1;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 0;
  box-shadow: 2px 0 15px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 0 1.5rem 1.5rem;
  border-bottom: 1px solid rgba(236, 240, 241, 0.1);
}

.sidebar-header .pi {
  font-size: 1.8rem;
  margin-right: 1rem;
}

.sidebar-title {
  font-size: 1.4rem;
  font-weight: 600;
}

.sidebar-nav {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  flex-grow: 1;
}

.sidebar-nav li {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  border-left: 4px solid transparent;
}

.sidebar-nav li:hover {
  background-color: rgba(236, 240, 241, 0.1);
}

.sidebar-nav li.active {
  background-color: rgba(52, 152, 219, 0.2);
  border-left-color: #3498db;
  color: #3498db;
}

.sidebar-nav .pi {
  font-size: 1.2rem;
  margin-right: 1rem;
  width: 20px;
  text-align: center;
}

.sidebar-nav span {
  font-size: 1rem;
  font-weight: 500;
}

.sidebar-footer {
  padding: 1.5rem;
  text-align: center;
  font-size: 0.8rem;
  color: #bdc3c7;
  border-top: 1px solid rgba(236, 240, 241, 0.1);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

.main-header {
  margin-bottom: 2rem;
}

.main-header h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.main-header p {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.dashboard-tabs {
  background: #ffffff;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.tab-content {
  padding: 1.5rem;
  min-height: 200px;
}

.quick-actions {
  display: flex;
  gap: 1rem;
}
</style>
