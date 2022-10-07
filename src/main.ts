import { createApp } from "vue";
import axios from 'axios';
import router from '@/router';
import i18n from './utils/i18n';
import VueAxios from 'vue-axios';
import VueToast from 'vue-toast-notification';
import { createPinia } from 'pinia';
import configureHTTPInterceptor from './config/configureHTTPInterceptor';
import App from "./App.vue";

// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-sugar.css';
import "./style.css";

const pinia = createPinia();
configureHTTPInterceptor();

createApp(App)
    .use(VueToast)
    .use(VueAxios, axios)
    .use(router)
    .use(pinia)
    .use(i18n)
    .mount("#app");
