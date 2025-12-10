<template>
  <div id="app">
    <!-- Modern Navigation Bar with PrimeVue -->
    <Menubar :model="menuItems" class="app-menubar">
      <template #start>
        <div class="app-logo">
          <i class="pi pi-compass" style="font-size: 1.5rem; margin-right: 0.5rem;"></i>
          <span class="app-title" style="margin-right: 0.5rem">Business Travel Tracker</span>
        </div>
      </template>
      <template #end>
        <div class="app-toolbar">
          <TestingInstructions />
          <LanguageSelector />
        </div>
      </template>
    </Menubar>

    <!-- Main content rendered by Vue Router -->
    <div class="app-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Menubar from 'primevue/menubar';
import LanguageSelector from "@/components/LanguageSelector.vue";
import TestingInstructions from "@/components/TestingInstructions.vue";

export default defineComponent({
  name: "App",
  components: {
    Menubar,
    LanguageSelector,
    TestingInstructions
  },
  computed: {
    menuItems() {
      return [
        {
          label: this.$t('Home') || 'Home',
          icon: 'pi pi-home',
          command: () => this.$router.push('/')
        },
        {
          label: this.$t('Trips') || 'Trips',
          icon: 'pi pi-map-marker',
          command: () => this.$router.push('/trips')
        },
        {
          label: this.$t('expenses') || 'Expenses',
          icon: 'pi pi-wallet',
          command: () => this.$router.push('/expenses')
        },
        {
          label: this.$t('Statistics') || 'Statistics',
          icon: 'pi pi-chart-bar',
          command: () => this.$router.push('/statistics')
        }
      ];
    }
  }
});
</script>

<style>
/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* PrimeVue component overrides */
.p-menubar {
  background: rgba(255, 255, 255, 0.98) !important;
  backdrop-filter: blur(20px);
  border: none !important;
  border-radius: 0 !important;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08) !important;
  padding: 1rem 2.5rem !important;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.p-menubar .p-menubar-start .app-logo {
  display: flex;
  align-items: center;
  font-weight: 700;
  color: #667eea;
  font-size: 1.3rem;
  padding: 0.5rem 0;
}

.app-toolbar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.p-menubar .p-menubar-start .app-title {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Enhanced menu items styling */
.p-menubar .p-menubar-root-list {
  gap: 0.5rem;
}

.p-menubar .p-menuitem {
  position: relative;
}

.p-menubar .p-menuitem-link {
  color: #555 !important;
  font-weight: 600 !important;
  font-size: 0.95rem !important;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
  padding: 0.875rem 1.5rem !important;
  border-radius: 12px !important;
  margin: 0 0.25rem !important;
  display: flex !important;
  align-items: center !important;
  gap: 0.75rem !important;
  position: relative;
  overflow: hidden;
}

.p-menubar .p-menuitem-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.p-menubar .p-menuitem-link:hover::before {
  opacity: 1;
}

.p-menubar .p-menuitem-link:hover {
  color: white !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.25) !important;
}

.p-menubar .p-menuitem-link .p-menuitem-text,
.p-menubar .p-menuitem-link .p-menuitem-icon {
  position: relative;
  z-index: 1;
}

.p-menubar .p-menuitem-link .p-menuitem-icon {
  font-size: 1.1rem !important;
  margin-right: 0 !important;
}

/* Active menu item styling */
.p-menubar .p-menuitem-link.router-link-active,
.p-menubar .p-menuitem-link[aria-current="page"] {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.p-menubar .p-menuitem-link.router-link-active::before,
.p-menubar .p-menuitem-link[aria-current="page"]::before {
  opacity: 1;
}

/* Language selector positioning */
.p-menubar .p-menubar-end {
  margin-left: auto;
  display: flex;
  align-items: center;
}

/* Responsive navigation */
@media (max-width: 768px) {
  .p-menubar {
    padding: 0.75rem 1rem !important;
  }

  .p-menubar .p-menubar-start .app-logo {
    font-size: 1.1rem;
  }

  .p-menubar .p-menuitem-link {
    padding: 0.75rem 1rem !important;
    font-size: 0.9rem !important;
  }

  .p-menubar .p-menuitem-link .p-menuitem-icon {
    font-size: 1rem !important;
  }
}

@media (max-width: 480px) {
  .p-menubar .p-menuitem-link .p-menuitem-text {
    display: none;
  }

  .p-menubar .p-menuitem-link {
    padding: 0.75rem !important;
    min-width: 3rem;
    justify-content: center;
  }

  .p-menubar .p-menubar-root-list {
    gap: 0.25rem;
  }
}
</style>
