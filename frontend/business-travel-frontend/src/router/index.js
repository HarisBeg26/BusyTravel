import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue'; // The home page
import HomeB from '@/views/HomeB.vue'; // Alternative home page for A-B testing
import TripsList from '@/views/TripsList.vue';
import TripsListB from '@/views/TripsListB.vue'; // Alternative trips list for A-B testing
import ExpensesList from '@/views/ExpensesList.vue';
import Statistics from '@/views/Statistics.vue';
import AddTrip from "@/views/AddTrip.vue";
import AddExpense from "@/views/AddExpense.vue";  // Import AddExpense.vue
import abTestingService from '@/services/abTestingService.js';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => {
            const variant = abTestingService.getUserVariant('home');
            return variant === 'B' ? HomeB : Home;
        }
    },
    {
        path: '/trips',
        name: 'TripsList',
        component: () => {
            const variant = abTestingService.getUserVariant('trips');
            return variant === 'B' ? TripsListB : TripsList;
        }
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
        path: '/add-expense',  // Define the route for Add Expense page
        name: 'AddExpense',
        component: AddExpense, // Associate the route with the AddExpense component
    },
    {
        path: '/statistics',
        name: 'Statistics',
        component: Statistics,
    },
    // Direct access routes for testing purposes (can be removed in production)
    {
        path: '/home-a',
        name: 'HomeA',
        component: Home,
    },
    {
        path: '/home-b',
        name: 'HomeB',
        component: HomeB,
    },
    {
        path: '/trips-a',
        name: 'TripsA',
        component: TripsList,
    },
    {
        path: '/trips-b',
        name: 'TripsB',
        component: TripsListB,
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// Add navigation guard to track page views
router.afterEach((to, from) => {
    // Track page view for A-B testing
    if (to.name === 'Home') {
        abTestingService.trackPageView('home');
    } else if (to.name === 'TripsList') {
        abTestingService.trackPageView('trips');
    }
});

export default router;
