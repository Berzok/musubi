import { createApp } from "vue";
import axios from 'axios';
import router from '@/router';
import i18n from './utils/i18n';
import VueAxios from 'vue-axios';
import VueToast from 'vue-toast-notification';
import PrimeVue from 'primevue/config';
import DialogService from 'primevue/dialogservice';
import { createPinia } from 'pinia';

import configureHTTPInterceptor from './config/configureHTTPInterceptor';
import App from "./App.vue";

// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-sugar.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap-utilities.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import "@/style.css";
import { itemStore } from '@/store/item';

const pinia = createPinia();
configureHTTPInterceptor();


createApp(App)
    .use(VueToast, {
        position: 'top-right'
    })
    .use(VueAxios, axios)
    .use(router)
    .use(pinia)
    .use(i18n)
    .use(PrimeVue)
    .use(DialogService)
    .mount("#app");
itemStore().init();
