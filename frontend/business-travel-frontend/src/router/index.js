import { createRouter, createWebHistory } from 'vue-router';
import abTestingService from '@/services/abTestingService.js';

// Original components (Version A)
import Home from '@/views/Home.vue';
import TripsList from '@/views/TripsList.vue';

// Alternative components (Version B)
import HomeB from '@/views/HomeB.vue';
import TripsListB from '@/views/TripsListB.vue';

// Other components
import ExpensesList from '@/views/ExpensesList.vue';
import Statistics from '@/views/Statistics.vue';
import AddTrip from "@/views/AddTrip.vue";
import AddExpense from "@/views/AddExpense.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => {
            const variant = abTestingService.getUserVariant('home');
            return variant === 'B' ? HomeB : Home;
        },
        meta: { testName: 'home' }
    },
    {
        path: '/trips',
        name: 'TripsList',
        component: () => {
            const variant = abTestingService.getUserVariant('trips');
            return variant === 'B' ? TripsListB : TripsList;
        },
        meta: { testName: 'trips' }
    },
    {
        path:'/add-trip',
        name: 'AddTrip',
        component:AddTrip,
    },
    {
        path: '/expenses',
        name: 'ExpensesList',
        component: ExpensesList,
    },
    {
        path: '/add-expense',
        name: 'AddExpense',
        component: AddExpense,
    },
    {
        path: '/statistics',
        name: 'Statistics',
        component: Statistics,
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// Track page views after each navigation
router.afterEach((to, from) => {
    // Ensure the route has a name to avoid tracking irrelevant navigations
    if (to.name) {
        const testName = to.meta.testName || 'default';
        abTestingService.trackPageView(String(to.name), { testName });
    }
});

export default router;

