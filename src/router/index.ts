import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useStore } from '@/store/user';
import Home from '@/components/Home.vue';

export const LOGIN_PAGE_NAME = 'login';
export const HOME_PAGE_NAME = 'Home';

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: () => import('../components/Home.vue'),
    },
    {
        path: '/list',
        name: 'list',
        component: () => import('../components/Table.vue'),
    },
    {
        path: '/view/:id',
        name: 'item',
        props: true,
        component: () => import('../components/utils/Item.vue'),
    },
    {
        path: '/send',
        name: 'send',
        component: () => import('../components/network/Send.vue')
    },
    {
        path: '/receive',
        name: 'receive',
        component: () => import('../components/network/Receive.vue')
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

routes.forEach((value => {
    value.meta = {
        transition: 'fade'
    }
}));

const router = createRouter({
    history: createWebHistory('/'),
    routes,
});
router.beforeEach((to, from, next) => {
    const main = useStore();
    return next();

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
