import { createRouter, createWebHistory } from "vue-router";
import Login from "./views/Login.vue";
import Dashboard from "./views/Dashboard.vue";
import AddTour from "./views/AddTour.vue";
import { isAuthenticated } from "./api.jsx";

const routes = [
    { path: "/", redirect: "/login" },
    { path: "/login", component: Login },
    { path: "/dashboard", component: Dashboard, meta: { requiresAuth: true } },
    { path: "/add-tour", component: AddTour, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuth = isAuthenticated();

    if (to.meta.requiresAuth && !isAuth) {
        next("/login");
    } else {
        next();
    }
});

export default router;
