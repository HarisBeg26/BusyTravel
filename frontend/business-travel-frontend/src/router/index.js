import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue'; // The home page
import TripsList from '@/views/TripsList.vue';
import ExpensesList from '@/views/ExpensesList.vue';
import Statistics from '@/views/Statistics.vue';
import AddTrip from "@/views/AddTrip.vue";
import AddExpense from "@/views/AddExpense.vue";  // Import AddExpense.vue

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,  // HomePage.vue will be displayed at the root
    },
    {
        path: '/trips',
        name: 'TripsList',
        component: TripsList,
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
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;
