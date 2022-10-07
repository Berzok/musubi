import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useStore } from '@/store/user';
import Home from '@/components/Home.vue';

export const LOGIN_PAGE_NAME = 'login';
export const HOME_PAGE_NAME = 'Home';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
    },
    // {
    //     path: '/about',
    //     name: 'About',
    //     // route level code-splitting
    //     // this generates a separate chunk (about.[hash].js) for this route
    //     // which is lazy-loaded when the route is visited.
    //     component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    // },
    // {
    //     path: '/profile',
    //     name: 'profile',
    //     component: () => import('../components/user/UserDetail.vue'),
    // },
    {
        path: '/authenticate',
        name: 'authenticate',
        meta: {requiresAuth: false},
        component: () => import('../components/authenticate/Authenticate.vue'),
        children: [
            {
                path: 'login',
                name: LOGIN_PAGE_NAME,
                meta: {requiresAuth: false},
                component: () => import('../components/authenticate/Login.vue'),
            },
            {
                path: 'register',
                name: 'register',
                meta: {requiresAuth: false},
                component: () => import('../components/authenticate/Register.vue'),
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});
router.beforeEach((to, from, next) => {
    const main = useStore();

    // by defining in by negation (to.meta.requiresAuth !== false) every page wich is not explicitly
    // defining to be without authentication needs to be authentication (security concerns)
    if (to.matched.some((record) => record.meta.requiresAuth !== false)) {
        if (main.isLogged) {
            next();
        } else {
            next({name: LOGIN_PAGE_NAME});
        }
    } else {
        next();
    }
});

export default router;
