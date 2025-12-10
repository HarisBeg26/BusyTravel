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
    const variant = ABTestRouter.getVariant();
    
    // Redirect home page based on variant
    if (to.path === '/' && variant === 'B') {
        next('/home-b');
    } else if (to.path === '/home-b' && variant === 'A') {
        next('/');
    }
    // Redirect trips page based on variant
    else if (to.path === '/trips' && variant === 'B') {
        next('/trips-b');
    } else if (to.path === '/trips-b' && variant === 'A') {
        next('/trips');
    }
    // All other routes proceed normally
    else {
        next();
    }
});

export default router;

