import { createRouter, createWebHistory } from 'vue-router';
import ABTestRouter from '@/utils/ABTestRouter';

import Home from '@/views/Home.vue';
import HomeVariantB from '@/views/HomeVariantB.vue';
import TripsList from '@/views/TripsList.vue';
import TripsListVariantB from '@/views/TripsListVariantB.vue';
import ExpensesList from '@/views/ExpensesList.vue';
import Statistics from '@/views/Statistics.vue';
import AddTrip from "@/views/AddTrip.vue";
import AddExpense from "@/views/AddExpense.vue";

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    {
        path: '/home-b',
        name: 'HomeVariantB',
        component: HomeVariantB,
    },
    {
        path: '/trips',
        name: 'TripsList',
        component: TripsList,
    },
    {
        path: '/trips-b',
        name: 'TripsListVariantB',
        component: TripsListVariantB,
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

// A/B Testing: Automatically redirect users to their assigned variant
router.beforeEach((to, from, next) => {
    // Check if user is directly accessing a variant page (e.g., via URL)
    const isDirectAccess = from.name === null || from.name === undefined;
    
    // If user directly accesses /home-b or /trips-b, assign them to variant B
    if (isDirectAccess && (to.path === '/home-b' || to.path === '/trips-b')) {
        sessionStorage.setItem('ab_test_variant', 'B');
        next();
        return;
    }
    
    // If user directly accesses / or /trips, assign them to variant A
    if (isDirectAccess && (to.path === '/' || to.path === '/trips')) {
        sessionStorage.setItem('ab_test_variant', 'A');
        next();
        return;
    }
    
    const variant = ABTestRouter.getVariant();
    
    // Only redirect if user is navigating (not direct URL access)
    if (!isDirectAccess) {
        // Redirect home page based on variant
        if (to.path === '/' && variant === 'B') {
            next('/home-b');
            return;
        } else if (to.path === '/home-b' && variant === 'A') {
            next('/');
            return;
        }
        // Redirect trips page based on variant
        else if (to.path === '/trips' && variant === 'B') {
            next('/trips-b');
            return;
        } else if (to.path === '/trips-b' && variant === 'A') {
            next('/trips');
            return;
        }
    }
    
    // All other routes proceed normally
    next();
});

export default router;

