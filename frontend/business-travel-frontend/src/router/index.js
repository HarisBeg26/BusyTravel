import {createRouter, createWebHistory} from "vue-router";

const routes = [
    {path: '/', name:"Home", component: () => import("../views/Home.vue")},
    {path:'/trips', name:"Trips", component: () => import("../views/TripsList.vue")},
    {path:'/trips/add', name:"AddTrip", component: () => import("../views/AddTrip.vue")},
    { path: "/expenses/:tripId", name: "Expenses", component: () => import("../views/ExpensesList.vue") },
    { path: "/expenses/:tripId/add", name: "AddExpense", component: () => import("../views/AddEditExpense.vue") },
    { path: "/statistics", name: "Statistics", component: () => import("../views/Statistics.vue") },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;